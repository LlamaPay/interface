| Method           | Type  |                                                           Decimals |
| :--------------- | :---: | -----------------------------------------------------------------: |
| depositAndCreate | Write | (amountPerSec \* 1e20), (amountToDeposit \* 10 \*\* tokenDecimals) |
| createStream     | Write |                                                   (amount \* 1e20) |
| deposit          | Write |                                  (amount \* 10 \*\* tokenDecimals) |
| approve          | Write |                                  (amount \* 10 \*\* tokenDecimals) |
| withdrawPayer    | Write |                                                  (amount \* 1e20 ) |
| getPayerBalance  | Read  |                                 (amount / (10 \*\* tokenDecimals)) |
| balanceOf        | Read  |                                 (amount / (10 \*\* tokenDecimals)) |
