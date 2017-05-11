## Psylab Version 1.0 ##

Psylab is a python based trading simulator. The idea is to build an ecosystem where talents can research and develop trading algorithms in the most efficient environment and the least number of lines.

### Before setup the project ###

* Ubuntu 14.04 or higher (16.04 recommended)
* Git Setup
* Text editor (Atom recommended)


If you do not want to setup the project but want to check it locally.


It will create a http server on 3000 port by default.

```
 cd /dist
 python -m SimpleHTTPServer  
```

### To set up the project ###

#### Note: Node.js is required. So install node.js first (https://nodejs.org/en/download/). ####

```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```


```
$ npm install -g npm
$ npm install -g bower
$ npm install -g gulp
```
 (use sudo if it says permission denied)


## If you are behind a proxy server ##
for npm

```
 npm config set proxy "http://proxy22.iitd.ernet.in:3128/"
```

```
$ cd /psy-frontend
$ npm install bower
$ npm install gulp
$ npm install
$ bower install
```

To run the project for changes or contributions.

```
$ gulp
```
If you are not familiar with SASS and Compass. Don't worry create your custom css file in CSS/ dir

If you want to use Sass for the builds,

1. install ruby on your local linux machine.

```
sudo apt-get install ruby-full
ruby -v
```

2. Install Sass, compass and any dependencies.

```
sudo su -c "gem install sass"
sudo su -c "gem install compass"

```
3. Compile the project's sass files into css

```
compass compile
```
Watch the project for changes and compile whenever it does

```
compass watch
```

#### Errors; ####

[16:58:24] Error in plugin 'gulp-jshint'
Message:
    Invalid reporter

install jshint-stylish as a dependency

```
npm install jshint-stylish
```


### Contribution guidelines ###
please remember following things before contribute to repository

* Create a different branch like if your name is **XYZ** then  branch name should be **dev-XYZ**
* Always use same branch for work
* **Don't** push your code to **master** branch
* create pull request after your changes



### If I find any bug/error then Who do I talk to? ###

Manish Kumar <manish9461@gmail.com>
