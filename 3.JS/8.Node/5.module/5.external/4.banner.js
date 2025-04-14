import chalk from 'chalk';
import figlet from 'figlet';

figlet('Hello World!', function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(chalk.blue(data));
});
