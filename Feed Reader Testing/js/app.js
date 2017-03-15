/* app.js
 *
 * 这是我们的 Rss 订阅阅读器应用。它使用 Goole Feed Reader API 将 RSS
 * 源转换成我们能够利用的 JSON 对象。它还使用了 Handlebars 模板库和 Jquery.
 */

// 所有的名字和链接都是真实可用的
var allFeeds = [
    {
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feed'
    }, {
        name: 'CSS Tricks',
        url: 'http://feeds.feedburner.com/CssTricks'
    }, {
        name: 'HTML5 Rocks',
        url: 'http://feeds.feedburner.com/html5rocks'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions'
    }
];

/* 这个函数负责启动我们的应用，Google Feed Reader API 会被异步加载
 * 然后调用这个方法。
 */
function init() {
    // 加载我们定义的第一个源。
    loadFeed(0);
}

/* 这个函数用 Google Feed Reader API 加载 RSS 源。然后做一些
 * DOM 操作使源的内容被展示在页面上。每个源都可以通过他们在 allFeeds
 * 数组里面的位置引用。这个函数还支持一个回调函数作为第二个参数，
 * 这个回调函数会在所有事情都成功完成之后被调用。
*/
 function loadFeed(id, cb) {
     var feedUrl = allFeeds[id].url,
         feedName = allFeeds[id].name;

     $.ajax({
       type: "POST",
       url: 'https://rsstojson.udacity.com/parseFeed',
       data: JSON.stringify({url: feedUrl}),
       contentType:"application/json",
       success: function (result, status){

                 var container = $('.feed'),
                     title = $('.header-title'),
                     entries = result.feed.entries,
                     entriesLen = entries.length,
                     entryTemplate = Handlebars.compile($('.tpl-entry').html());

                 title.html(feedName);   // 设置 header
                 container.empty();      // 将之前的所有内容置空

                 /* 遍历所有我们通过 Google Feed Reader API 加载的条目，然后用
                  * entryTemplate （上面用 Handerbars 创建的）解析每个条目。然后
                  * 把转换得到的 HTML 添加到页面上的条目列表。
                 */
                 entries.forEach(function(entry) {
                     container.append(entryTemplate(entry));
                 });

                 if (cb) {
                     cb();
                 }
               },
       error: function (result, status, err){
                 // 如果有错，就不解析结果而是只运行回调函数。
                 if (cb) {
                     cb();
                 }
               },
       dataType: "json"
     });
 }

/* Google API: 加载 Feed Reader API 和定义当加载结束之后调用什么函数。*/
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* 所有的这些功能都严重依赖 DOM 。所以把我们的代码放在 $ 函数里面以保证在 DOM
 * 构建完毕之前它不会被执行。
 */
$(function() {
    var container = $('.feed'),
        feedList = $('.feed-list'),
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        feedId = 0,
        menuIcon = $('.menu-icon-link');

    /* 遍历我们所有的源，给每个源添加一个基于位置索引的 ID 。然后用
     * feedItemTemplate （上面用 Handlebars 创建的）来解析那个源。
     * 然后添加到菜单里面的现有源列表。
    */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));

        feedId++;
    });

    /* 当我们的源列表中的一个链接被点击的时候，我们想要隐藏菜单，加载该源，
     * 组织链接的默认点击行为发生。
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* 当菜单图标被点击的时候，我们需要在 body 元素上切换一个类名来实现
     * 菜单的显示状态的切换。
     */
    menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });
}());
