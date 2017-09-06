<?php
require 'vendor/autoload.php';
$f3 = \Base::instance();
$cache = \Cache::instance();
$cache->load("folder=cache/");

// Warmup
if (!$cache->exists('last_timestamp')) $cache->set('last_timestamp', time());
if (!$cache->exists('likes')) $$cache->set('likes', []);
if (!$cache->exists('dislikes')) $$cache->set('dislikes', []);

$f3->route('POST /like',
    function() {
        $cache = \Cache::instance();
	$likes = $cache->get('likes');
	$microtime = intval(microtime(true) * 1000);
	$likes = array_filter($likes, function ($ts) use ($microtime) { return $ts > $microtime - 60000; });
	array_push($likes, $microtime);
	$cache->set('likes', $likes);
	echo "Liked at $microtime";
    }
);
$f3->route('POST /dislike',
    function() {
        $cache = \Cache::instance();
	$dislikes = $cache->get('dislikes');
	$microtime = intval(microtime(true) * 1000);
	$dislikes = array_filter($dislikes, function ($ts) use ($microtime) { return $ts > $microtime - 60000; });
	array_push($dislikes, $microtime);
	$cache->set('dislikes', $dislikes);
    }
);
$f3->route('GET /events/@since',
    function($f3, $params) {
	$nowMicrotime = intval(microtime(true) * 1000);
	$sinceMicrotime = intval($params['since']);
        $cache = \Cache::instance();
        $remaining = 300 - (time() - $cache->get('last_timestamp'));
	if ($remaining < 0) $remaining = 0;
        $likes = $cache->get('likes');
	$likes = array_filter($likes, function($ts) use ($sinceMicrotime, $nowMicrotime) { return ($ts >= $sinceMicrotime && $ts < $nowMicrotime); });
        $dislikes = $cache->get('dislikes');
	$dislikes = array_filter($dislikes, function($ts) use ($sinceMicrotime, $nowMicrotime) { return ($ts >= $sinceMicrotime && $ts < $nowMicrotime); });
	echo json_encode(
		[
			'likes'=> count($likes),
			'dislikes' => count($dislikes),
			'remaining' => $remaining,
			'tick' => $nowMicrotime,
		]
	);
    }
);
$f3->route('POST /reset',
    function() {
        $cache = \Cache::instance();
        $cache->set("last_timestamp", time());
        $cache->set("likes", []);
        $cache->set("dislikes", []);
    }
);
$f3->set('CORS.origin','*');
$f3->run();
