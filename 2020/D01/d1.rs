/*
 * Advent Of Code 2020
 * Day 1: Report Repair part 1 & 2
 * 
 * https://adventofcode.com/2020/day/1
 * 
 * Rust 2018
 **/

use std::fs;

fn read_input(filename: &str) -> Vec<i32> {
  let input:Vec<i32> = match fs::read_to_string(filename) {
    Err(msg) => {
      println!("Can't read input file:{}",filename);
      println!("Error:{}",msg);
      std::process::exit(-1);
    },
    Ok(string) => string.split("\n").filter(|s| s.len() > 0)
      .map(|s| {
        match s.trim().parse::<i32>() {
          Ok(num) => num,
          Err(_) => {
            println!("Input error");
            std::process::exit(-1)
          }
        }
      }).collect(),
  };
  input
}

fn part1(input:&Vec<i32>) -> i32 {

  for (i, v1) in input.iter().enumerate() {
    for v2 in input[i+1..].iter() {
      if v1+v2 == 2020 {
        println!("Result: {}:{} -> {}",v1,v2, v1*v2) ;
        return v1* v2;
      }
    }
  };
  return -1;
}

fn part2(input:&Vec<i32>) -> i32 {
  
  for (i, v1) in input.iter().enumerate() {
    for (j, v2) in input[i+1..].iter().enumerate() {
      for v3 in input[i+j+1..].iter() {
        if v1+v2+v3 == 2020 {
          println!("Result: {}:{}:{} -> {}",v1,v2,v3, v1*v2*v3) ;
          return v1*v2*v3;
        }
      }
    }
  };
  return -1;
}

fn main() {
  let input:Vec<i32> = read_input("2020/D01/d1-input.txt") ;
  println!("Part 1: {}",part1(&input)) ;
  println!("Part 2: {}",part2(&input)) ;
}
