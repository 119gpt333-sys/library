CREATE TABLE `books` (
	`id` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`publisher` varchar(255) NOT NULL,
	`publishedYear` int NOT NULL,
	`genre` varchar(64) NOT NULL,
	`description` text NOT NULL,
	`rating` int NOT NULL DEFAULT 0,
	`reviewCount` int NOT NULL DEFAULT 0,
	`totalCopies` int NOT NULL DEFAULT 1,
	`availableCopies` int NOT NULL DEFAULT 1,
	`isNew` int NOT NULL DEFAULT 0,
	`isAvailable` int NOT NULL DEFAULT 1,
	`coverColor` varchar(7) NOT NULL,
	`coverEmoji` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(64) NOT NULL,
	`reason` text NOT NULL,
	`nickname` varchar(64) NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`liked` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rentals` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(64) NOT NULL,
	`rentalDate` timestamp NOT NULL DEFAULT (now()),
	`dueDate` timestamp NOT NULL,
	`returnedAt` timestamp,
	`extensionCount` int NOT NULL DEFAULT 0,
	`status` enum('active','returned','overdue') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rentals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(64) NOT NULL,
	`rating` int NOT NULL,
	`text` text,
	`nickname` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`userId` int NOT NULL,
	`nickname` varchar(64) NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`bookId` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);
