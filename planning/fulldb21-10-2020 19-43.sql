#
# TABLE STRUCTURE FOR: Projects
#

DROP TABLE IF EXISTS `Projects`;

CREATE TABLE `Projects` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `tickets` int(9) unsigned NOT NULL,
  `personnel` int(9) unsigned NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: Tickets
#

DROP TABLE IF EXISTS `Tickets`;

CREATE TABLE `Tickets` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `summary` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `priority` enum('high','medium','low') NOT NULL,
  `deadline` varchar(255) NOT NULL,
  `type` enum('feature','bug','epic') NOT NULL,
  `reportedBy` int(9) unsigned NOT NULL,
  `completedBy` int(9) unsigned NOT NULL,
  `assignedTo` int(9) unsigned NOT NULL,
  `createdOn` timestamp NULL DEFAULT current_timestamp(),
  `status` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# TABLE STRUCTURE FOR: User
#

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('boss','middler','grunt') NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

