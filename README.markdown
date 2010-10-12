**Features** ([demo][1])

* Parse epgp.lua file created by the World of Warcraft EPGP addon 
  (http://code.google.com/p/epgp/) using javascript/jQuery only.
* Display results as a table of standings, loot or both.
* Adjust EPGP or Loot slider to show EP changes, GP changes & loot from 
  a set number of days from the snapshot.
* Loot links to wowhead show item quality color and tooltips.
* Choose from either a dark or light stylesheet, or make your own.

**Usage & Options (defaults)**

Script:

    $('#epgp').epgp({
     // EPGP Standings table options
     epgpfile         : 'epgp.lua',        // epgp.lua file name
     guild            : 'Fallout',         // Guild name (include captial letters and any spaces in the name)
     startEpgpHistory : 7,                 // EPGP Standings History - initial number of days to show prior to snapshot
     startLootHistory : 7,                 // Loot History - initial number of days to show prior to snapshot
     addSliders       : true,              // Add slider to adjust the changes in ep/gp (green & red values) or the loot history popup
     maxHistory       : 30,                // Slider max number of days.
     extras           : '100%',            // Extras - set here because it's not in the lua
     lootIcon         : 'images/plus.gif', // Icon to hover over to see a list of recent loot, styled in the css
     sort             : [3,1],             // sort table by 3rd column (PR column, 0 indexed) in descending order (1).

     // Loot table only options (includes startLootHistory above)
     lootOnly         : false,             // if true, will only display a loot history table
     raidTime         : 4,                 // Approximate raid time in hours (substracted from snapshot time to ensure loot drops are included)
     fixClass         : []                 // fix class for toon not in the database (alt in a different guild), use as follows:
                                           // add a name: var x = []; x['Toon Name'] = 'class';
                                           // 'Toon Name' should be the exact name you see in the table (include capitals & spaces)
                                           // class = character class or defined CSS class (so you can add any color)
                                           // initialize script $(selector).epgp({ fixClass: x });
    });

HTML:

Standings Table / Loot Table:

    <div id="epgp"></div>

**Changelog**

Version 1.1 (9/19/2010)
* Internalized Standings header & table HTML and sliders
* Added slider options - addSliders & maxHistory

Version 1.0 (8/25/2010)

* Epgp script posted on github.

 [1]: http://mottie.github.com/epgp/