-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 21, 2023 at 11:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grocery_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_tb`
--

CREATE TABLE `product_tb` (
  `pid` int(11) NOT NULL,
  `pname` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pimg` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_tb`
--

INSERT INTO `product_tb` (`pid`, `pname`, `price`, `pimg`) VALUES
(1, 'Pork - Chop, Frenched', 0.67, '../data/img/img1.png'),
(2, 'Apple', 19.28, '../data/img/img2.png'),
(3, 'Venison - Ground', 3.42, '../data/img/img3.png'),
(4, 'Ice Cream - Life Savers', 8.24, '../data/img/img4.png'),
(5, 'Hummus - Spread', 13.41, '../data/img/img5.png'),
(6, 'Chestnuts - Whole,canned', 18.99, '../data/img/img6.png'),
(7, 'Jolt Cola', 2.05, '../data/img/img7.png'),
(8, 'Sole - Dover, Whole, Fresh', 15.46, '../data/img/img8.png'),
(9, 'Quiche Assorted', 0.23, '../data/img/img9.png'),
(10, 'Lobster - Tail, 3 - 4 Oz', 16.76, '../data/img/img10.png'),
(11, 'Appetizer - Assorted Box', 7.89, '../data/img/img11.png'),
(12, 'Salt - Table', 23.68, '../data/img/img12.png'),
(13, 'Ecolab - Solid Fusion', 10.51, '../data/img/img13.png'),
(14, 'Berry Brulee', 1.36, '../data/img/img14.png'),
(15, 'Pastry - Carrot Muffin - Mini', 13.51, '../data/img/img15.png'),
(16, 'Tuna - Yellowfin', 5.20, '../data/img/img16.png'),
(17, 'Figs', 9.42, '../data/img/img17.png'),
(18, 'Cranberries - Frozen', 12.42, '../data/img/img18.png'),
(19, 'Squash - Guords', 3.26, '../data/img/img19.png'),
(20, 'Sprouts - China Rose', 3.68, '../data/img/img20.png'),
(21, 'Venison - Liver', 18.15, '../data/img/img21.png'),
(22, 'Pasta - Fusili, Dry', 17.17, '../data/img/img22.png'),
(23, 'The Pop Shoppe - Grape', 13.13, '../data/img/img23.png'),
(24, 'Fiddlehead - Frozen', 1.65, '../data/img/img24.png');

-- --------------------------------------------------------

--
-- Table structure for table `user_tb`
--

CREATE TABLE `user_tb` (
  `uid` int(11) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `position` varchar(50) NOT NULL,
  `pass` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_tb`
--

INSERT INTO `user_tb` (`uid`, `fname`, `lname`, `position`, `pass`) VALUES
(1, 'Sayaka', 'Maki', 'Admin', '$2y$10$OfEF2Ip7MVvXEj6tYaYLZOb.9hR2kxLL8t2Bm1jUZyIv.g0Tm/.xe'),
(2, 'Joao', 'Lamb', 'Staff', '$2y$10$mER545.6TsMsUT1JFOz7MeRZsSbnxutGqa4uQrb8Hj0sgmUIIroJq'),
(3, 'Bernardo', 'Mainardi', 'Admin', '$2y$10$lCJGsmVVLBoAKSnon5atAu2v8fBddDvTS72mB7fU4KE3PGVgsVJWK'),
(4, 'Bladys', 'Omer', 'Staff', '$2y$10$wlduavsE/SxMF5zRUHlPw.qM0iBkK346Y7TMUY.XCzJnNJZT90Goa'),
(5, 'John', 'Some', 'Staff', '$2y$10$ZpVBwDOXuoKjc6pAo3RL6ukmPoQSsT2/oxOPWKzKTCR/HnTRyWT8.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product_tb`
--
ALTER TABLE `product_tb`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `user_tb`
--
ALTER TABLE `user_tb`
  ADD PRIMARY KEY (`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
