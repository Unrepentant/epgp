/* EPGP - script to parse & display standings data from the epgp.lua created
 * by the World of Warcraft EPGP addon (http://code.google.com/p/epgp/)
 * http://github.com/Mottie/epgp
 *
 * Author: Rob G, aka Mottie (mottie.guildportal.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * v1.0 8/25/2010 Original version, posted to github
 */

 (function($){

  $.fn.epgp = function(options) {
   // build main options before element iteration
   var opts = $.extend({}, $.fn.epgp.defaults, options);
   // iterate and reformat each matched element
   return this.each(function() {
    var $this = $(this);
    // build element specific options
    var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

    // variables
    var i, t, tmp, m, num, n, n2 = 'negative', p = 'positive';

    // Update EPGP & Loot data by slider position
    // ******************************************
    var update = function(base){
     // Gather point history from log
     var ep = [], gp = [], lootHx = [], lastItem = [], lg = base.log,
     // history x days * 24hours * 60minutes * 60seconds * 1000milliseconds / 1000 (stored in the lua as seconds)
     epgpHist = (base.snapshot.time - ($this.find('.slider:first').data('value') || o.startEpgpHistory) * 24 * 60 * 60),
     lootHist = (base.snapshot.time - ($this.find('.slider:last').data('value') || o.startLootHistory) * 24 * 60 * 60);

     for ( i = 0; i < lg.length; i++ ){
      t = lg[i][0];
      // if time > "hist" = time since (1 month by default), then gather the points
      if (t > epgpHist || t > lootHist){
       // If the name doesn't exist, initialize the array
       n = lg[i][2]; // character name
       m = lg[i][3]; // loot/reason
       if (t > epgpHist){
        if ( typeof(ep[n]) == 'undefined' ) {
         ep[n] = 0;
         gp[n] = 0;
        }
        // Add up the EP and GP changes
        ep[n] += (lg[i][1] == "EP") ? lg[i][4] : 0;
        gp[n] += (lg[i][1] == "GP") ? lg[i][4] : 0;
       }
       if (t > lootHist && m.match('Hitem')){
        // Look for item link: "|cff0070dd|Hitem:14150:0:0:0:0:0:0:1497790976:80|h[Robe of Evocation]|h|r"
        // text color = #0070dd (ignore the cff in front)
        // item id = # after Hitem: = 14150
        if (typeof(lootHx[n]) == 'undefined') {
         lootHx[n] = '<div class="title">Loot History for ' + n + '</div>' +
          '<table class="loot"><tr class="header"><th class="date">Time</th><th class="item">Item</th><th class="gp">GP</th></tr>';
        }
        m = m.split('|');
        t = new Date(lg[i][0] * 1000);
        tmp = t.toDateString().split(' ');
        lastItem[n] = '<a style="color:#' + m[1].slice(-6) + '" href="http://www.wowhead.com/item=' + m[2].split(':')[1] +
         '">' + m[3].replace(/h\[|\]/g,'') + '</a>';
        lootHx[n] += '<tr><td class="date">' + tmp[2] + ' ' + tmp[1] + ' ' + t.toLocaleTimeString() +
         '</td><td class="item">' + lastItem[n] + '</td><td class="gp">' + lg[i][4] + '</td></tr>';
       }
      }
     }
     return [ep, gp, lootHx, lastItem];
    };

    // Process the epgp data
    // *********************
    var showEpgp = function(){
     // Header Data
     var base = $this.data('data').namespaces.log.profiles[o.guild],
         vars = base.snapshot.guild_info.split('\n'), // @BASE_GP:1000\n@MIN_EP:1000\n@DECAY_P:15
         basegp = parseInt(vars[0].split(':')[1],10),
         date = new Date(base.snapshot.time * 1000),  // Date stored in lua as seconds (not milliseconds)
         hours = date.getHours(),
         ampm = (hours > 12) ? 'PM' : 'AM';
         hours = (hours > 12) ? hours-12 : hours;

     // Update header
     $this.find('.date').html( date.toDateString() + ' ' + hours + ':' + date.getMinutes() + ' ' + ampm );
     $this.find('.decay').html(vars[2].split(':')[1] + '%');
     $this.find('.min').html(vars[1].split(':')[1]);
     $this.find('.base').html(basegp);
     $this.find('.extras').html(o.extras);

     // Build table
     var u = update(base), e, g, pr, data = base.snapshot.roster_info;
     t = '';
     for (i=0; i<data.length; i++){
      tmp = data[i][2].split(',');
      // Include groups with data and don't have '0' EP
      if (tmp.length > 1 && tmp[0] != '0'){
       // n[0] = name, n[1] = class, n[2] = "ep,gp"
       n = data[i];
       tmp = n[2].split(',');
       e = parseInt(tmp[0],10);
       g = parseInt(tmp[1],10) + basegp;
       pr = (g === 0) ? '' : (e/g).toFixed(3);
       if (pr === 0) { pr = '0'; }
       t += '<tr><td class="name ' + n[1].toLowerCase() + '"><span class="data">' + n[0] + '</span></td><td class="ep"><span class="data">' +
         tmp[0] + '</span> <span class="diff ';
       e = u[0][n[0]] || '';
       t += (e === 0 || e === '') ? '' : (e < 0) ? n2 : p;
       t += '">' + e + '</span></td><td class="gp"><span class="data">' + g + '</span> <span class="diff ';
       g = u[1][n[0]] || '';
       t += (g === 0 || g === '') ? '' : (g < 0) ? n2 : p;
       t += '">' + g + '</span></td><td class="pr"><span class="data">' + pr + '</span></td><td class="lastitem">';
       t += (typeof(u[2][n[0]]) == 'undefined') ? '' : '<img src="' + o.lootIcon + '" class="tooltip" title="' +
        u[2][n[0]].replace(/\"/g,'&quot;') + '</table>">';
       t += (typeof(u[3][n[0]]) == 'undefined') ? '' : '<span class="data">' + u[3][n[0]] + '</span>';
       t += '</td></tr>';
      }
     }

     // Show results
     if (t === '') {
      $this.html('<div align="center">No Data Found!</div>');
     } else {
      $this.find('tbody').append(t); // IE likes appending to tbody

      // Add table sorting
      $this.find('table').tablesorter({
       textExtraction: function(node) {
        return $(node).find('span.data').text();
       },
       sortList: [o.sort] // Initial sort by PR column in descending order (high to low)
      });

      // Initialize EPGP & loot sliders
      $this.find('.slider')
       .slider({
        min   : 1,
        max   : 30,
        step  : 1,
        slide : function(e,ui){
         $(this).data('value',ui.value);
         $(this).parent().find('.count').html(ui.value);
         var c, u = update(base); // u[ep, gp, lootHx, lastItem];
         $this.find('tbody tr').each(function(){
          n = $(this).find('.name span').html();
          num = Math.round(u[0][n]) || '';
          c = (num === 0 || num === '') ? '' : (num < 0) ? n2 : p;
          $(this).find('.ep .diff').removeClass(n2 + ' ' + p).addClass(c).html(num);

          num = Math.round(u[1][n]) || '';
          c = (num === 0 || num === '') ? '' : (num < 0) ? n2 : p;
          $(this).find('.gp .diff').removeClass(n2 + ' ' + p).addClass(c).html(num);

          // update tooltip
          $(this).find('.lastitem img').attr('title', u[2][n]);
         });
        }
       });
       // Initial slider data & display
       $this.find('.sliders')
        .find('.slider:first')
         .slider('option', 'value', o.startEpgpHistory )
         .data('value', o.startEpgpHistory).end()
        .find('.count:first').html(o.startEpgpHistory).end()
        .find('.slider:last')
         .slider('option', 'value', o.startLootHistory )
         .data('value', o.startLootHistory).end()
        .find('.count:last').html(o.startLootHistory);
     }
    };

    // Show Loot Only
    // ***************
    var showLoot = function(){
     var j, c, cls = [],
     base = $this.data('data').namespaces.log.profiles[o.guild],
     m = base.snapshot.roster_info,
     lg = base.log,
     ln = lg.length - 1,
     // Calculate loot history to include (snapshot time minus # days to include minus # hours of raid time)
     lootHist = base.snapshot.time - ((o.startLootHistory - 1) * 24 * 60 * 60) - (o.raidTime * 60 * 60),
     loot = '<table class="loot"><tr class="header"><th class="date">Time</th><th class="member">Member</th>' +
      '<th class="item">Item</th><th class="gp">GP</th></tr>';
     t = '';

     // Get character class from roster data
     for ( i=0; i<m.length; i++){
      cls[m[i][0]] = m[i][1].toLowerCase();
     }
     // add predefined classes
     $.extend(cls,o.fixClass);

     // Build Loot Table
     for ( j=0; j<ln; j++){
      i = ln - j; // reverse the loot order
      t = lg[i][0]; // time
      m = lg[i][3]; // loot/reason

      // if time > lootHist = time since snapshot (7 days by default)
      if (t > lootHist && m.match('Hitem')){
       // Look for item link: "|cff0070dd|Hitem:14150:0:0:0:0:0:0:1497790976:80|h[Robe of Evocation]|h|r"
       // text color = #0070dd (ignore the cff in front)
       // item id = # after Hitem: = 14150
       n = lg[i][2]; // character name
       m = m.split('|');
       t = new Date(lg[i][0] * 1000);
       tmp = t.toDateString().split(' '); // reformat time
       c = (typeof(cls[n]) == 'undefined') ? 'unknown' : cls[n]; // check wow class
       loot += '<tr><td class="date">' + tmp[2] + ' ' + tmp[1] + ' ' + t.toLocaleTimeString().replace(/:00\s/g,' ') +
        '</td><td class="member ' + c.toLowerCase() + '">' + n + '</td><td class="item"><a style="color:#' + m[1].slice(-6) +
        '" href="http://www.wowhead.com/item=' + m[2].split(':')[1] + '">' + m[3].replace(/h\[|\]/g,'') +
        '</a></td><td class="gp">' + lg[i][4] + '</td></tr>';
      }
      if ( t < lootHist ) { break; }
     }

     // Show results
     loot = (loot.length < 150) ? '<div align="center">No Data Found!</div>' : loot + '</table>';
     $this.html(loot);
    };

    // Get File & save data
    // ********************
    $.ajax({
     url: o.epgpfile,
     success: function(data){
      // Reformat LUA to JSON
      var d = data
       .replace(/\[(.*)\]\s\=\s/g,'$1:')     // change equal to colon & remove outer brackets
       .replace(/[\t\r\n]/g,'')              // remove tabs & returns
       .replace(/\}\,\s--\s\[\d+\]\}/g,']]') // replace sets ending with a comment with square brackets
       .replace(/\,\s--\s\[\d+\]/g,',')      // remove close subgroup and comment
       .replace(/,(\}|\])/g,'$1')            // remove trailing comma
       .replace(/\}\,\{/g,'],[')             // replace curly bracket set with square brackets
       .replace(/\{\{/g,'[[')                // change double curlies to square brackets
       .replace(/EPGP_DB\s\=/,'');           // remove variable definition
      // convert string to JSON variable
      var b = $.parseJSON(d);
      $this.data('data',b);
      if (o.lootOnly) {
       showLoot();
      } else {
       showEpgp();
      }
     },
     error: function(){
      $this.html('<div align="center">No Data Found!</div>');
     }
    });
   });
  };

  $.fn.epgp.defaults = {
   // EPGP Standings table options
   epgpfile         : 'epgp.lua', // epgp.lua file name
   guild            : 'Fallout',  // Guild name (include captial letters and any spaces in the name)
   startEpgpHistory : 7,          // EPGP Standings History - initial number of days to show prior to snapshot
   startLootHistory : 7,          // Loot History - initial number of days to show prior to snapshot
   extras           : '100%',     // Extras - set here because it's not in the lua
   lootIcon         : 'images/plus.gif', // Icon to hover over to see a list of recent loot, styled in the css
   sort             : [3,1],      // sort table by 3rd column (PR column, 0 indexed) in descending order (1).

   // Loot table only options (includes startLootHistory above)
   lootOnly         : false,      // if true, will only display a loot history table
   raidTime         : 4,          // Approximate raid time in hours (substracted from snapshot time to ensure loot drops are included)
   fixClass         : []          // fix class for toon not in the database (alt in a different guild), use as follows:
                                  // add a name: var x = []; x['Toon Name'] = 'class';
                                  // 'Toon Name' should be the exact name you see in the table (include capitals & spaces)
                                  // class = character class or defined CSS class (so you can add any color)
                                  // initialize script $(selector).epgp({ fixClass: x });
  };

})(jQuery);