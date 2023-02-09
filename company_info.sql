-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2023 at 04:49 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `company_info`
--

-- --------------------------------------------------------

--
-- Table structure for table `company_info`
--

CREATE TABLE `company_info` (
  `id` int(11) NOT NULL,
  `link` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `type` varchar(256) NOT NULL,
  `tax_code` varchar(16) NOT NULL,
  `address` varchar(512) NOT NULL,
  `owner` varchar(256) NOT NULL,
  `sign_date` varchar(64) NOT NULL,
  `active_date` varchar(64) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `status` varchar(64) NOT NULL,
  `data_raw` text NOT NULL,
  `email` varchar(256) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `company_link`
--

CREATE TABLE `company_link` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `link` varchar(512) NOT NULL,
  `source` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `company_source`
--

CREATE TABLE `company_source` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `company_source`
--

INSERT INTO `company_source` (`id`, `name`, `updated_at`) VALUES
(1, 'tratencongty', '2023-02-08 14:06:45'),
(2, 'hosocongty', '2023-02-09 13:47:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company_info`
--
ALTER TABLE `company_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `link` (`link`);

--
-- Indexes for table `company_link`
--
ALTER TABLE `company_link`
  ADD PRIMARY KEY (`id`),
  ADD KEY `source` (`source`);

--
-- Indexes for table `company_source`
--
ALTER TABLE `company_source`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company_info`
--
ALTER TABLE `company_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `company_link`
--
ALTER TABLE `company_link`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `company_source`
--
ALTER TABLE `company_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_link`
--
ALTER TABLE `company_link`
  ADD CONSTRAINT `company_link_ibfk_1` FOREIGN KEY (`source`) REFERENCES `company_source` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
