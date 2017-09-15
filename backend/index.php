<?php
require '../vendor/autoload.php';
$f3 = \Base::instance();

if (getenv('SKIP_CONFIG_FILE')) {
	foreach(['LIMIT_MAX_ITEMS_COUNT', 'LIMIT_MAX_ITEMS_AGE', 'HIDDEN_SECRET', 'HIDDEN_KEY'] as $key) {
		define($key, getenv($key));
	}
} else {
	require 'config.php';
}


// Temporal cache
$cache = \Cache::instance();
$cache->load("folder=cache/");

// Persistence
function getDB() {
	$jawsdb = getenv('JAWSDB_URL');
	if ($jawsdb) {
		$parts = parse_url($jawsdb);
		return new \DB\SQL($parts['scheme'] . ':' . 'host=' . $parts['host'] . ';port=' . $parts['port'] . ';dbname=' . substr($parts['path'], 1), $parts['user'] , $parts['pass']);
	} else {
		return new \DB\SQL('sqlite:../db/db.sqlite');
	}
}

function getCurrentPresentation($db) {
	$rows = $db->exec(
		'SELECT id,name,started_at,ended_at,paused_at,resumed_at,remaining,likes,dislikes
		FROM presentation
		WHERE ended_at is null
		ORDER BY id DESC'
	);
	return count($rows) > 0 ? $rows[0] : null;
}

function calculateRemaining($presentation, $at) {
	if (!$presentation['paused_at']) {
		$reference = $presentation['resumed_at'] ?: $presentation['started_at'];
		$remaining = $presentation['remaining'] - ($at - $reference);
		if ($remaining < 0) $remaining = 0;
		return $remaining;
	} else {
		return $presentation['remaining'];
	}
}

function calculateStatus($presentation) {
	if (!$presentation) return 'stopped';
	if ($presentation['paused_at']) {
		return 'paused';
	} else {
		return 'running';
	}
}

// Warmup
if (!$cache->exists('likes')) $cache->set('likes', []);
if (!$cache->exists('dislikes')) $cache->set('dislikes', []);

$f3->redirect('GET /', getenv('REACT_APP_API_ENDPOINT') . '/index.html');

$f3->route('POST /like',
    function() {
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
        $cache = \Cache::instance();
	$likes = $cache->get('likes');
	$utime = intval(microtime(true) * 1000);
	$likes = array_filter(
		$likes,
		function ($e) use ($utime) { return $e > $utime - LIMIT_MAX_ITEMS_AGE*1000; }
	);
	if (count($likes) < LIMIT_MAX_ITEMS_COUNT) {
		array_push($likes, $utime);
		$cache->set('likes', $likes);
		if ($currentPresentation) {
			$db->exec(
				'UPDATE presentation
				SET likes = likes + 1
				WHERE id = :id',
				[
					':id' => $currentPresentation['id']
				]
			);
		}
	}
    }
);
$f3->route('POST /dislike',
    function() {
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
        $cache = \Cache::instance();
	$dislikes = $cache->get('dislikes');
	$utime = intval(microtime(true) * 1000);
	$dislikes = array_filter(
		$dislikes,
		function ($e) use ($utime) { return $e > $utime - LIMIT_MAX_ITEMS_AGE*1000; }
	);
	if (count($dislikes) < LIMIT_MAX_ITEMS_COUNT) {
		array_push($dislikes, $utime);
		$cache->set('dislikes', $dislikes);
		if ($currentPresentation) {
			$db->exec(
				'UPDATE presentation
				SET dislikes = dislikes + 1
				WHERE id = :id',
				[
					':id' => $currentPresentation['id']
				]
			);
		}
	}
    }
);
$f3->route('GET /updates/@since',
    function($f3, $params) {
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
	$utimeNow = intval(microtime(true) * 1000);
	$utimeSince = intval($params['since']);
        $cache = \Cache::instance();
        $likes = $cache->get('likes');
	$likes = array_filter($likes, function($ts) use ($utimeSince, $utimeNow) { return ($ts >= $utimeSince && $ts < $utimeNow); });
        $dislikes = $cache->get('dislikes');
	$dislikes = array_filter($dislikes, function($ts) use ($utimeSince, $utimeNow) { return ($ts >= $utimeSince && $ts < $utimeNow); });
	$output = [
		'isAdmin' => false,
		'likes'=> count($likes),
		'dislikes' => count($dislikes),
		'remaining' => 300,
		'tick' => $utimeNow,
		'status' => calculateStatus($currentPresentation),
	];
	if ($currentPresentation) {
		$remaining = calculateRemaining($currentPresentation, time());
		$output['remaining'] = $remaining;
	}
	if ($f3->exists('is_admin') && $f3->get('is_admin') !== true) {
		$output['isAdmin'] = true;
	}
	echo json_encode($output);
    }
);

$f3->route('GET /results', function($f3, $params) {
	if (!$f3->exists('HEADERS.Authentication') || $f3->get('HEADERS.Authentication') !== HIDDEN_KEY) {
		$f3->error(401);
		return;
	}
	$db = getDB();
	$rows = $db->exec(
		'SELECT id, from_unixtime(started_at) as start_time, from_unixtime(ended_at) as end_time, likes, dislikes
		FROM presentation
		WHERE ended_at is not null
		ORDER BY id DESC'
	);

	echo json_encode($rows);
});

$f3->route('POST /login',
    function($f3, $params) {
	// Wrong password
	$params = json_decode($f3->get('BODY', '{}'), true);
	if ($params['password'] != HIDDEN_SECRET) {
		$f3->error(401);
		return;
	}
	echo json_encode(['apiKey' => HIDDEN_KEY]);
    }
);
$f3->route('POST /start',
    function($f3) {
	// Protected method
	if (!$f3->exists('HEADERS.Authentication') || $f3->get('HEADERS.Authentication') !== HIDDEN_KEY) {
		$f3->error(401);
		return;
	}
	$db = getDB();
	$rows = $db->exec(
		"INSERT INTO presentation(name,started_at,ended_at,resumed_at,paused_at,remaining,likes,dislikes)
		VALUES(
			null,
			:time,
			null,
			null,
			null,
			300,
			0,
			0
		)", [":time" => time()]
	);
	// Reset cache
        $cache = \Cache::instance();
        $cache->set("likes", []);
        $cache->set("dislikes", []);
    }
);
$f3->route('POST /stop',
    function($f3) {
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
	// Protected method
	if (!$f3->exists('HEADERS.Authentication') || $f3->get('HEADERS.Authentication') !== HIDDEN_KEY) {
		$f3->error(401);
		return;
	}
	if ($currentPresentation) {
		$db->exec(
			"UPDATE presentation set ended_at = :time WHERE id = :id",
			[":id" => $currentPresentation['id'], ":time" => time()]
		);
	}
    }
);
$f3->route('POST /pause',
    function($f3) {
	// Protected method
	if (!$f3->exists('HEADERS.Authentication') || $f3->get('HEADERS.Authentication') !== HIDDEN_KEY) {
		$f3->error(401);
		return;
	}
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
	$time = time();
	$remaining = calculateRemaining($currentPresentation, $time);
	if ($currentPresentation) {
		$db->exec(
			"UPDATE presentation set paused_at = :paused_at, remaining = :remaining WHERE id = :id",
			[":id" => $currentPresentation['id'], ':paused_at' => $time, ':remaining' => $remaining]
		);
	}
    }
);
$f3->route('POST /resume',
    function($f3) {
	$db = getDB();
	$currentPresentation = getCurrentPresentation($db);
	// Protected method
	if (!$f3->exists('HEADERS.Authentication') || $f3->get('HEADERS.Authentication') !== HIDDEN_KEY) {
		$f3->error(401);
		return;
	}
	if ($currentPresentation) {
		$db->exec(
			"UPDATE presentation set paused_at = null, resumed_at = :resumed_at WHERE id = :id",
			[":id" => $currentPresentation['id'], ':resumed_at' => time()]
		);
	}
    }
);
$f3->copy('HEADERS.Origin','CORS.origin');
$f3->set('CORS.headers', 'Authentication');
$f3->run();
