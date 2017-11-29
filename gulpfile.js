let gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    sh = require('shelljs'),
    babel = require('gulp-babel');
gulp.task('minify', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
    // [...]
});
gulp.task('test', function () {
  return gulp.src('./static/src/js/test.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./static/js/'));
});
let paths = {
    components: ['./static/bower_components/jquery/dist/jquery.min.js','bower_components/bootstrap/dist/js/bootstrap.min.js',
      './static/bower_components/angular/angular.min.js', './static/bower_components/angular-animate/angular-animate.js',
      './static/bower_components/angular-sanitize/angular-sanitize.js', './static/bower_components/angular-touch/angular-touch.js',
      './static/bower_components/angular-ui-router/release/angular-ui-router.js','./static/bower_components/ngstorage/ngStorage.js',
      './static/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './static/bower_components/oclazyload/dist/ocLazyLoad.js','./static/plugins/qiao.js',
      './static/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.js',
      // './static/bower_components/angular-ui-grid/ui-grid.min.js',
      './static/plugins/async.min.js',
      './static/plugins/contextMenu.js'
      ],
  bundlejs:['./static/src/js/app.js','./static/src/js/config.js','./static/src/js/config.lazyload.js','./static/src/js/config.router.js',
      './static/src/js/main.js','./static/src/js/services/ui-load.js','./static/src/js/services/param.js','./static/src/js/filters/fromNow.js',
      './static/src/js/directives/setnganimate.js','./static/src/js/directives/toaste-html.js','./static/src/js/directives/angulartree.js',
      './static/src/js/directives/ui-butterbar.js','./static/src/js/directives/ui-focus.js','./static/src/js/directives/ui-fullscreen.js',
      './static/src/js/directives/ui-jq.js','./static/src/js/directives/ui-module.js','./static/src/js/directives/ui-nav.js',
      './static/src/js/directives/ui-scroll.js','./static/src/js/directives/ui-shift.js','./static/src/js/directives/ui-toggleclass.js',
      './static/src/js/services/modal.js','./static/src/js/controllers/bootstrap.js','./static/src/js/controllers/base/modal.js',
      './static/src/js/util/errors.js','./static/src/js/util/errcode.js','./static/src/js/util/util.js','./static/src/js/util/treeSource.js'
  ],
    srcjs: ['static/src/js/**/*.js'],
    html: ['static/html/**/*.html'],
    imgs: ['static/img/**/*']
};

gulp.task('css', function(done) {
    gulp.src(['./static/bower_components/bootstrap/dist/css/bootstrap.css',
        './static/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.min.css',
        './static/bower_components/animate.css/animate.css',
        './static/src/css/font.css','./static/src/css/app.css'])
        .pipe(plugins.concat('all.css'))
        .pipe(gulp.dest('./static/css/'))
        .pipe(plugins.minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.rename('all.min.css'))
        //.pipe(plugins.rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./static/css/'))
        .pipe(plugins.notify({ message: 'css task complete' }))
        .on('end', done);
});
// 检查脚本
/*gulp.task('lint', function() {
    gulp.src('./static/angular/!**!/!*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});*/
// 合并，压缩components文件
gulp.task('components', function() {
    gulp.src(paths.components)
        .pipe(plugins.concat('components.js'))
        .pipe(gulp.dest('./static/js'))
        .pipe(plugins.rename('components.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./static/js'))
        .pipe(plugins.notify({ message: 'components js complete' }));
});

// 合并，压缩基本的文件
gulp.task('bundle', function() {
    gulp.src(paths.bundlejs)
        .pipe(plugins.concat('bundle.js'))
        .pipe(gulp.dest('./static/js'))
        .pipe(plugins.rename('bundle.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./static/js'))
        .pipe(plugins.notify({ message: 'bundle js task complete' }));
});
gulp.task('srcjs', function() {
    gulp.src(paths.srcjs)
        .pipe(plugins.changed('./static/js'))
//        .pipe(plugins.jshint())
//         .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./static/js'))
        .pipe(plugins.notify({ message: 'src task complete' }))
        .pipe(plugins.livereload());
});

// 图片
gulp.task('imgs', function() {
    return gulp.src('./static/src/img/**/*')
        // .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./static/img'))
        .pipe(plugins.notify({ message: 'Images task complete' }));
});
/*gulp.task('webserver', function () {
    plugins.connect.server({
        name: 'Dist App',
        root: 'public/src',
        port: 8000,
        livereload: true
    });
});*/
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('static/src/html/**/*.html')
        .pipe(plugins.changed('./static/html'))
        .pipe(plugins.htmlmin(options))
        .pipe(gulp.dest('./static/html'))
        .pipe(plugins.notify({ message: 'Html task complete' }))
        .pipe(plugins.livereload());
    gulp.src('static/src/index.min.html')
        .pipe(plugins.rename('index.html'))
        .pipe(plugins.htmlmin(options))
        .pipe(gulp.dest('./static/'))
        .pipe(plugins.notify({ message: 'index html task complete' }))
        .pipe(plugins.livereload());
});
// 清理
gulp.task('clean', function() {
    return gulp.src(['./tmp/*.js', './static/img'], {read: false})
        .pipe(plugins.clean());
});
// 预设任务
gulp.task('dist', ['clean'], function() {
    gulp.start('css', 'components','bundle','srcjs','imgs', 'html');
});
// 看守所有.scss js img 档
 gulp.task('default',function(event) {
   // 建立即时重整伺服器
   plugins.livereload.listen();
   gulp.watch(paths.css, ['css']);
   gulp.watch(paths.srcjs,['srcjs','bundle']);
   gulp.watch(['static/src/index.html','static/src/index.min.html','static/src/html/**/**/*.html'], ['html']);

});


