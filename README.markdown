##Features ([demo][1])

* Parse epgp.lua file created by the World of Warcraft EPGP addon 
  (http://code.google.com/p/epgp/) using javascript/jQuery only.
* Display results as a table of standings, loot or both.
* Adjust EPGP or Loot slider to show EP changes, GP changes & loot from 
  a set number of days from the snapshot.
* Loot links to wowhead show item quality color and tooltips.
* Choose from either a dark or light stylesheet, or make your own.
* Language options added to allow easy modification.

##Usage & Options (defaults)

###Script:

    // Optional Language Options
    var languageOptions = {
     wowhead       : 'www',               // 'de' = Deutsch, 'www' = English, 'es' = Espanol, 'fr' = Francais, 'ru' = russian
     lootTitle     : 'Loot History for ', // Standings loot tooltip
     nameTitle     : 'Name',              // Standings table
     timeTitle     : 'Time',              // Loot table & tooltip
     dateTitle     : 'Date',              // Standings Date
     memberTitle   : 'Member',            // Loot table 
     itemTitle     : 'Item',              // Loot table & tooltip
     lastItemTitle : 'Last Item',         // Standings
     baseGPTitle   : 'BaseGP',            // Standings
     minEPTitle    : 'MinEP',             // Standings
     decayTitle    : 'Decay',             // Standings
     extrasTitle   : 'Extras',            // Standings
     epgpSlider    : 'EPGP ({days} days from snapshot)', // {days} will be replaced by the current slider position
     lootSlider    : 'Loot ({days} days from snapshot)', // {days} will be replaced by the current slider position
     noData        : 'No Data Found!',
     noGuild       : 'Guild Not Found!'
    };
    // end optional language options

    $('#epgp').epgp({
     // EPGP Standings table options
     epgpfile         : 'epgp.lua',        // epgp.lua file name
     guild            : 'Wolfpax',         // Guild name (include captial letters and any spaces in the name)
     startEpgpHistory : 7,                 // EPGP Standings History - initial number of days to show prior to snapshot
     startLootHistory : 7,                 // Loot History - initial number of days to show prior to snapshot
     addSliders       : true,              // Add slider to adjust the changes in ep/gp (green & red values) or the loot history popup
     maxHistory       : 30,                // Slider max number of days.
     baseGP           : '1000',            // Base GP
     minEP            : '1000',            // Minimum EP
     decay            : '15',              // Decay
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
    }, languageOptions);                   // remove ", languageOptions" if you aren't using them

###HTML:

Standings Table / Loot Table (use unique ID if both are on the same page):

    <div id="epgp"></div>

##Changelog

Version 1.3 (3/11/2011)

* Updated to work with jQuery 1.5+.
* Fixed PR column sorting.

Version 1.2 (12/13/2010)

* Updated to work with epgp addon v5.5.22.
* Added options to set `decay`, `baseGP` and `minEP` which was removed from the lua in this latest version.
* Added `language` options to change the text output in the tables.
* Added `wowhead` option inside the language option to change the wowhead links to match the language.

Version 1.1 (9/19/2010)

* Internalized Standings header & table HTML and sliders
* Added slider options - addSliders & maxHistory

Version 1.0 (8/25/2010)

* Epgp script posted on github.

 [1]: http://Unrepentant.github.com/epgp/