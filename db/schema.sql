CREATE TABLE presentation(
	`id` int,
	`name` varchar(255),
	`started_at` int,
	`ended_at` int,
	`paused_at` int,
	`resumed_at` int,
	`remaining` int,
	`likes` int,
	`dislikes` int,
	PRIMARY KEY(`id`)
);
