import axios from "axios";
import Chart from 'chart.js';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i+=1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class Analytics {
  constructor(block) {
      this.appBlock = block;
      this.lang = 'en-US';
      this.transtations = [];
      this.pieBlock = null;
      this.pie = null;
      this.lineBlock = null;
      this.line = null;
      this.accounts = [];
  }

  generateTitle() {
    axios.get(`https://croesus-backend.herokuapp.com/transactions/all`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
    })
    .then((transaction) => {
      axios.get(`https://croesus-backend.herokuapp.com/accounts/all`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
      }).then((account) => {
        axios.get(`https://croesus-backend.herokuapp.com/users`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        }).then((user) => {
          this.transactions = transaction.data.transactions;
          this.accounts = account.data.accounts;
          this.user = user.data.user;
          while (this.appBlock.firstChild) {
            this.appBlock.removeChild(this.appBlock.firstChild);
          }
          const analyticsBlock = document.createElement('div');
          analyticsBlock.classList.add('analytics');
          const pieTitle = document.createElement('div');
          pieTitle.classList.add('analytics__title');
          pieTitle.textContent = `${new Date().toLocaleString(this.lang, { month: 'long' })}`;
          const pieGraphBlock = document.createElement('div');
          pieGraphBlock.classList.add('analytics__pie-graph');const pieGraph = document.createElement('canvas');
          pieGraphBlock.appendChild(pieGraph)
          this.pieBlock = pieGraph;
          analyticsBlock.append(...[pieTitle, pieGraphBlock]);
          const lineTitle = document.createElement('div');
          lineTitle.classList.add('analytics__title');
          lineTitle.textContent = `Last Month in ${this.user.settings.currency}`;
          const lineGraphBlock = document.createElement('div');
          lineGraphBlock.classList.add('analytics__line-graph');
          const lineGraph = document.createElement('canvas');
          lineGraphBlock.appendChild(lineGraph)
          this.lineBlock = lineGraph;
          this.appBlock.append(analyticsBlock);
          this.generateExpense(analyticsBlock);
          analyticsBlock.append(...[lineTitle, lineGraphBlock]);
        })
        .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
    })
    .catch((error) => {
        console.log(error);
    })
  }

  renderChart(income, expenses, userText, date, currency) {
    if(this.line) this.line.destroy();
    this.line = new Chart(this.lineBlock.getContext('2d'), {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: 'income',
            data: income,
            backgroundColor:
              'rgba(51, 236, 158, 0.2)'
            ,
            borderColor:
              'rgba(51, 236, 158, 1)'
            ,
            borderWidth: 1,
            pointBorderColor:
              'rgba(51, 236, 158, 1)'
            ,
            pointBackgroundColor:
              'rgba(51, 236, 158, 1)'
          },
          {
            label: 'expenses',
            data: expenses,
            backgroundColor:
              'rgba(236, 51, 107, 0.2)'
            ,
            borderColor:
              'rgba(236, 51, 107, 1)'
            ,
            borderWidth: 1,
            pointBorderColor:
              'rgba(236, 51, 107, 1)'
            ,
            pointBackgroundColor:
              'rgba(236, 51, 107, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: userText,
          display: false
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: '#ffffff'
            },
            ticks: {
              fontColor: '#fff',
              autoSkip: true,
              autoSkipPadding: 40,
              maxRotation: 0
              // callback: (value) => new Date(value).toLocaleString(this.lang,{month: 'long'})
            }
          }],
          yAxes: [{
            gridLines: {
              color: '#ffffff'
            },
            ticks: {
              fontColor: '#fff',
              beginAtZero: true,
              callback: (value) => `${value} ${currency} `
            }
          }]
        }
      }
    });
  }

  renderPie(labels, data, backgroundColor) {
    if(this.pie) this.pie.destroy();
    this.pie = new Chart(this.pieBlock.getContext('2d'), {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: "Expense pie",
          display: false
        },
        legend: {
          display: false,
        }
      }
    });
  }

  generateExpense(block) {
    const curDate = new Date();
    const curMonth = curDate.getMonth();
    const curYear = curDate.getFullYear();

    const values = [];
    const names = [];
    const colors = [];
    let totalSum = 0;

    this.transactions.filter( transaction =>
      transaction.income === false && new Date(transaction.createdAt).getMonth() === curMonth && curYear === new Date(transaction.createdAt).getFullYear()
    )
    .forEach(value => {
      // eslint-disable-next-line no-underscore-dangle
      const account = this.accounts.find(acc => acc._id === value.accountId);
      if (account && account.currency === this.user.settings.currency) {
        if (names.indexOf(value.type) === -1) {
          names.push(value.type);
          values.push(value.sum);
          colors.push(getRandomColor());
        } else {
          values[names.indexOf(value.type)] = values[names.indexOf(value.type)] + value.sum;
        };
          totalSum += value.sum;
      }
    });

    const expenses = [];
    const dates = [];
    const income = [];

    this.transactions.filter( transaction =>
      transaction.income === false && new Date(transaction.createdAt) > curDate.getDate() - 30
    )
    .forEach(value => {
      // eslint-disable-next-line no-underscore-dangle
      const account = this.accounts.find(acc => acc._id === value.accountId);
      if (account && account.currency === this.user.settings.currency) {
        console.log(value.income);
        if (dates.indexOf(new Date(value.createdAt).toLocaleString().split(',')[0]) === -1) {
          dates.push(new Date(value.createdAt).toLocaleString().split(',')[0]);
          expenses.push( value.income ? 0 : 0-value.sum)
          income.push( value.income ? value.sum : 0)
        } else if (value.income) {
          income[dates.indexOf(new Date(value.createdAt).toLocaleString().split(',')[0])] = income[dates.indexOf(new Date(value.createdAt).toLocaleString().split(',')[0])] + value.sum;
        } else {
          expenses[dates.indexOf(new Date(value.createdAt).toLocaleString().split(',')[0])] = expenses[dates.indexOf(new Date(value.createdAt).toLocaleString().split(',')[0])] - value.sum;
        }
      }
    });


    this.renderPie(names, values.map(value => Math.round(value/totalSum*100)), colors);

    names.forEach((name, index) => {
      const dataSet = document.createElement('div');
      dataSet.classList.add('chart-data');
      const color = document.createElement('div');
      color.classList.add('chart-data__color');
      color.style.backgroundColor = colors[index];
      dataSet.appendChild(color);
      const data = document.createElement('span');
      data.classList.add('chart-data__text');
      data.textContent = name;
      dataSet.appendChild(data);
      const percent = document.createElement('span');
      percent.classList.add('chart-data__percent');
      percent.textContent = `${values[index]} ${this.user.settings.currency} - ${Math.round(values[index]/totalSum*100)}%`;
      dataSet.appendChild(percent);
      block.appendChild(dataSet);
    });

    setTimeout(() => {
      this.renderChart(income, expenses, "text", dates, this.user.settings.currency);
    }, 10);

    window.onresize = () => {
      this.renderPie(names, values.map(value => Math.round(value/totalSum*100)), colors);
      this.renderChart(income, expenses, "text", dates, this.user.settings.currency);
    }
  }
}