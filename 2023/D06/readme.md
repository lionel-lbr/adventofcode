## Brut force solution

The brut force solution is simply to go from 1 to (time -1) and at each iteration check `i \* (time - i) > distance` is true to increment the solution count.

## Take advantage of palindrome sequence

It can be optimized a little as the results are actually a palindrome sequence. Let take the first example with time: 7 where the sequence goes like this: 1x6, 2x5, 3x4, 4x3, 5x2, 6x1. We need to generate only half of the sequence (1x6, 2x5, 3x4) and increment the solution count by 2 each time the calculation satisfy the condition `i \* (time - i) > distance`

A special case has to be handle when the sequence has a odd number of elements, for example with time: 8. In that case the sequence will be 1x7, 2x6, 3x5, 4x4, 5x3, 6x2, 7x1. This sequence is still a palindrome but the center element doesn't repeat (4x4) in the case the solution count has to be increment by 1 and not 2.

The problem can be reduce to a math sequence:
-->
[B.......T]
<--

Where B is the bottom value of the sequence and T is the top (in fact time -1). The calculation of each value of the sequence is:
(B+n)x(T-n) = BT - Bn + nT - n2 = BT +n(T-B) -n2

In our case B is always 1 so the whole formula can be reduce to T +n(T-1) - n2.
with:
n=0 -> T = 6
n=1 -> T+T-1-1 = 2T - 2 = 12-2 = 10
n=2 -> T + 2T -2 -4 = 3T -6 = 12
n=3 -> T + 3T - 3 -9 = 4T - 12 = 12
n=4 -> T + 4T - 4 -16 = 5T - 20 = 10
We can stop iterating when the next result is not higher than the previous one.
