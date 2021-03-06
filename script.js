'use strict';

// Accounts
const account1 = {
  owner: 'Niklas Svensson',
  movements: [2000, 4500, -4000, 30000, -6500, -1300, 700, 13000],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'SEK',
  locale: 'sv-SE',
};

const account2 = {
  owner: 'Emma Andersson',
  movements: [50000, 34000, -1500, -7900, -32100, -10000, 85000, -300],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'SEK',
  locale: 'sv-SE',
};

const account3 = {
  owner: 'Austin Miller',
  movements: [2000, -2000, 3400, -3000, -200, 500, 4000, -4600],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Helen Moss',
  movements: [4300, 10000, 7000, 500, 900],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

const displayMoves = function (acc, sort = false) {
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  moves.forEach(function (movement, index) {
    labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
      now
    );
    const transactionDate = new Intl.DateTimeFormat(acc.locale).format(
      new Date(acc.movementsDates[index])
    );
    const transactionType = movement < 0 ? 'withdrawal' : 'deposit';
    const formattedMovement = new Intl.NumberFormat(acc.locale).format(
      movement
    );
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${transactionType}">${
      index + 1
    } ${transactionType}</div>
        <div class="movements__date">${transactionDate}</div>
          <div class="movements__value">${formattedMovement} ${
      acc.currency
    }</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(element => element[0])
      .join('');
  });
};
createUsername(accounts);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);
const reducer = (previous, current) => previous + current;
const balance = movements.reduce(reducer);

const CalcDisplayBalance = function (movements, locale, currency) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${new Intl.NumberFormat(locale).format(
    balance
  )} ${currency}`;
};

const calcDisplaySummary = function (acc, currency, locale) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat(locale).format(
    incomes
  )} ${currency}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${new Intl.NumberFormat(locale).format(
    out
  )} ${currency}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${new Intl.NumberFormat(locale).format(
    interest
  )} ${currency}`;
};

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  logoutTimer();
  currentAccount = accounts.find(
    acc => acc.username == inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `${currentAccount.owner}`;
    displayMoves(currentAccount);
    CalcDisplayBalance(
      currentAccount.movements,
      currentAccount.locale,
      currentAccount.currency
    );
    calcDisplaySummary(
      currentAccount,
      currentAccount.currency,
      currentAccount.locale
    );
    containerApp.style.opacity = 100;
  } else alert('Please enter correct PIN.');
});

const logoutTimer = function () {
  let time = 300;
  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started`;
    }
  }, 1000);
};

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const transferTo = accounts.find(
    user => user.username == inputTransferTo.value
  );
  if (inputTransferTo.value == currentAccount.username)
    alert("Cannot transfer money to sender's account");
  else {
    if (transferTo) {
      const transferAmount = Number(inputTransferAmount.value);
      transferTo.movements.push(transferAmount);
      currentAccount.movements.push(-Math.abs(transferAmount));
      const now = new Date();
      currentAccount.movementsDates.push(now.toISOString());
      transferTo.movementsDates.push(now.toISOString());
      alert(
        `Transfer: ${transferAmount} ${currentAccount.currency} to ${transferTo.owner} succeeded`
      );
      displayMoves(currentAccount);
      CalcDisplayBalance(
        currentAccount.movements,
        currentAccount.locale,
        currentAccount.currency
      );
      calcDisplaySummary(
        currentAccount,
        currentAccount.currency,
        currentAccount.locale
      );
    } else alert('Please enter a valid username');
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  currentAccount.movements.push(loanAmount);
  const now = new Date();
  currentAccount.movementsDates.push(now.toISOString());
  alert(`Loan request: ${loanAmount} SEK to ${currentAccount.owner} succeeded`);
  displayMoves(currentAccount);
  CalcDisplayBalance(
    currentAccount.movements,
    currentAccount.locale,
    currentAccount.currency
  );
  calcDisplaySummary(
    currentAccount,
    currentAccount.currency,
    currentAccount.locale
  );
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (!currentAccount.username === inputCloseUsername.value)
    alert('Please enter correct username for account');
  else if (currentAccount.username === inputCloseUsername.value) {
    if (currentAccount.pin == inputClosePin.value) {
      const accountIndex = accounts.findIndex(
        account => account.username == currentAccount.username
      );
      const confirmation = confirm(
        'Account and movements will be deleted. Proceed?'
      );
      if (confirmation) {
        accounts.splice(accountIndex, 1);
        alert('Account removed. Thank you for doing business with our bank.');
        containerApp.style.opacity = 0;
      }
    }
  }
});

let sortedMovements = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault;
  displayMoves(currentAccount, !sortedMovements);
  btnSort.blur();
  sortedMovements = !sortedMovements;
});
