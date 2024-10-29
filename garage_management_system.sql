-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2024 at 02:46 PM
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
-- Database: `garage_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `contact` int(25) NOT NULL,
  `deals` varchar(20) NOT NULL,
  `customer` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeesalaary`
--

CREATE TABLE `employeesalaary` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `salary_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeesalaary`
--

INSERT INTO `employeesalaary` (`id`, `name`, `job_title`, `date`, `salary`, `salary_status`) VALUES
(1, 'asdasd', 'Mechanic', '2024-09-10', 34234.00, 'Paid'),
(2, 'asd', 'Boom loader operator', '2024-09-04', 123123.00, 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `employee_task`
--

CREATE TABLE `employee_task` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(50) NOT NULL,
  `task` varchar(50) NOT NULL,
  `work_hours` int(10) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` time(6) NOT NULL,
  `task_status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `amount` int(50) NOT NULL,
  `payment_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `name`, `vehicle`, `description`, `date`, `amount`, `payment_status`) VALUES
(2, 'sdsd', 'Crane: 50-Ton', 'qweqwew', '2024-09-01T12:36:56.000Z', 344, 'Online'),
(3, 'sdsd', 'Crane: 50-Ton', 'qweqwew', '2024-09-01T12:36:56.000Z', 344, 'Online'),
(4, 'hhh', 'Boomloader: 540', 'llllllsd', '2024-09-12T12:39:03.000Z', 234234, 'Online');

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `id` int(11) NOT NULL,
  `name` varchar(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `salary` int(50) NOT NULL,
  `salary_status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` time(6) NOT NULL,
  `advance` int(50) NOT NULL,
  `pending` int(50) NOT NULL,
  `project_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pending`
--

CREATE TABLE `pending` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `location` varchar(50) NOT NULL,
  `date` varchar(255) NOT NULL,
  `advance` int(50) NOT NULL,
  `pending` int(50) NOT NULL,
  `total` int(50) NOT NULL,
  `payment_status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `location` varchar(50) NOT NULL,
  `charges` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employeesalaary`
--
ALTER TABLE `employeesalaary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_task`
--
ALTER TABLE `employee_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pending`
--
ALTER TABLE `pending`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employeesalaary`
--
ALTER TABLE `employeesalaary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_task`
--
ALTER TABLE `employee_task`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pending`
--
ALTER TABLE `pending`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
