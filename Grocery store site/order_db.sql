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
-- Database: `order_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `12182023_orderhistory`
--

CREATE TABLE `12182023_orderhistory` (
  `pid` int(11) NOT NULL,
  `pname` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pimg` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `12182023_orderhistory`
--

INSERT INTO `12182023_orderhistory` (`pid`, `pname`, `price`, `pimg`, `amount`, `total`) VALUES
(1, 'Pork - Chop, Frenched', 0.67, '../data/img/img1.png', 1, 0.67),
(8, 'Sole - Dover, Whole, Fresh', 15.46, '../data/img/img8.png', 3, 46.38);

-- --------------------------------------------------------

--
-- Table structure for table `12192023_orderhistory`
--

CREATE TABLE `12192023_orderhistory` (
  `pid` int(11) NOT NULL,
  `pname` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pimg` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `12192023_orderhistory`
--

INSERT INTO `12192023_orderhistory` (`pid`, `pname`, `price`, `pimg`, `amount`, `total`) VALUES
(2, 'Apple', 19.28, '../data/img/img2.png', 1, 19.28),
(3, 'Venison - Ground', 3.42, '../data/img/img3.png', 3, 10.26),
(9, 'Quiche Assorted', 0.23, '../data/img/img9.png', 2, 0.46),
(19, 'Squash - Guords', 3.26, '../data/img/img19.png', 1, 3.26),
(22, 'Pasta - Fusili, Dry', 17.17, '../data/img/img22.png', 1, 17.17),
(23, 'The Pop Shoppe - Grape', 13.13, '../data/img/img23.png', 1, 13.13);

-- --------------------------------------------------------

--
-- Table structure for table `12202023_orderhistory`
--

CREATE TABLE `12202023_orderhistory` (
  `pid` int(11) NOT NULL,
  `pname` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pimg` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `12202023_orderhistory`
--

INSERT INTO `12202023_orderhistory` (`pid`, `pname`, `price`, `pimg`, `amount`, `total`) VALUES
(1, 'Pork - Chop, Frenched', 0.67, '../data/img/img1.png', 1, 0.67),
(2, 'Apple', 19.28, '../data/img/img2.png', 3, 57.84),
(3, 'Venison - Ground', 3.42, '../data/img/img3.png', 9, 30.78),
(4, 'Ice Cream - Life Savers', 8.24, '../data/img/img4.png', 23, 189.52),
(10, 'Lobster - Tail, 3 - 4 Oz', 16.76, '../data/img/img10.png', 1, 16.76),
(16, 'Tuna - Yellowfin', 5.20, '../data/img/img16.png', 2, 10.40),
(17, 'Figs', 9.42, '../data/img/img17.png', 1, 9.42);

-- --------------------------------------------------------

--
-- Table structure for table `12212023_orderhistory`
--

CREATE TABLE `12212023_orderhistory` (
  `pid` int(11) NOT NULL,
  `pname` varchar(50) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `pimg` varchar(50) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `12212023_orderhistory`
--

INSERT INTO `12212023_orderhistory` (`pid`, `pname`, `price`, `pimg`, `amount`, `total`) VALUES
(2, 'Apple', 19.28, '../data/img/img2.png', 1, 19.28),
(5, 'Hummus - Spread', 13.41, '../data/img/img5.png', 4, 53.64),
(6, 'Chestnuts - Whole,canned', 18.99, '../data/img/img6.png', 1, 18.99),
(25, 'Tomato', 2.34, '../data/img/img25.png', 1, 2.34);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `12182023_orderhistory`
--
ALTER TABLE `12182023_orderhistory`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `12192023_orderhistory`
--
ALTER TABLE `12192023_orderhistory`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `12202023_orderhistory`
--
ALTER TABLE `12202023_orderhistory`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `12212023_orderhistory`
--
ALTER TABLE `12212023_orderhistory`
  ADD PRIMARY KEY (`pid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
