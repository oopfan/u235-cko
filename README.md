# u235-cko
A collection of useful tools for astrophotography.

See it in action [here](https://u235.herokuapp.com/#) at Heroku.

It is a Single Page Application (SPA) written in JavaScript ES5,
KnockoutJs, and Bootstrap 4. This site's structure is courtesy of
[classical-ko](https://github.com/eriksvaleng/generator-classical-ko),
a Yeoman generator.

While I am thankful to *eriksvaleng* I must warn you that the package.json
file the generator creates uses package versions that are woefully out of
date. In fact npm complained of 14 vulnerabilities, and when I created the
repository GitHub sent me a bunch of emails warning me of said vulnerabilities.

It took me the better part of a day to bring all of the packages current and
test. Also I found that the *gulp-requirejs-bundler* was so far out of date
that I chose to replace it with *gulp-requirejs*. Also I rewrote gulpfile.js to
use Gulp 4. I'll make a note to fork the generator and submit these changes.

In the meantime if you are interested in creating a SPA using KnockoutJs then
I encourage you to use my repository. It will save you a lot of work.
