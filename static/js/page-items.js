

function parsesource (src) {
	source = src.trim();
	if (source == "monster manual") source = "MM";
	if (source == "Player's Handbook") source = "PHB";
	if (source == "Dungeon Master's Guide") source = "DMG";
	if (source == "Volo's Guide") source = "VGM";
	if (source == "Volo's Guide to Monsters") source = "VGM";
	if (source == "Princes of the Apocalypse") source = "PotA";
	if (source == "Elemental Evil PDF supplement") source = "EEPC";
	if (source == "elemental evil") source = "PotA";
	if (source == "Storm King's Thunder") source = "SKT";
	if (source == "storm kings thunder") source = "SKT";
	if (source == "The Rise of Tiamat") source = "RoT";
	if (source == "Rise of Tiamat Online Supplement") source = "RoT";
	if (source == "Hoard of the Dragon Queen") source = "HotDQ";
	if (source == "tyranny of dragons") source = "ToD";
	if (source == "Out of the Abyss") source = "OotA";
	if (source == "out of the abyss") source = "OotA";
	if (source == "Curse of Strahd") source = "CoS";
	if (source == "curse of strahd") source = "CoS";
	if (source == "Sword Coast Adventurer's Guide") source = "SCAG";
	if (source == "Lost Mines of Phandelver") source = "LMoP";
	if (source == "lost mine of phandelver") source = "LMoP";
	if (source == "Modern Magic Unearthed Arcana") source = "UA";
	if (source == "Tales from the Yawning Portal") source = "TYP";
	return source;
}

function parsetype (type) {
	if (type === "G") return "Adventuring Gear"
	if (type === "SCF") return "Spellcasting Focus"
	if (type === "AT") return "Artisan Tool"
	if (type === "T") return "Tool"
	if (type === "GS") return "Gaming Set"
	if (type === "INS") return "Instrument"
	if (type === "A") return "Ammunition"
	if (type === "M") return "Melee Weapon"
	if (type === "R") return "Ranged Weapon"
	if (type === "LA") return "Light Armor"
	if (type === "MA") return "Medium Armor"
	if (type === "HA") return "Heavy Armor"
	if (type === "S") return "Shield"
	if (type === "W") return "Wondrous Item"
	if (type === "P") return "Potion"
	if (type === "ST") return "Staff"
	if (type === "RD") return "Rod"
	if (type === "RG") return "Ring"
	if (type === "WD") return "Wand"
	if (type === "SC") return "Scroll"
	if (type === "EXP") return "Explosive"
	if (type === "GUN") return "Firearm"
	if (type === "SIMW") return "Simple Weapon"
	if (type === "MARW") return "Martial Weapon"
	if (type === "VEH") return "Vehicle"
	if (type === "TAH") return "Tack and Harness"
	if (type === "MNT") return "Mount"
	if (type === "TG") return "Trade Good"
	return "n/a"
}

function parsedamagetype (damagetype) {
	if (damagetype === "B") return "bludgeoning"
	if (damagetype === "P") return "piercing"
	if (damagetype === "S") return "slashing"
	if (damagetype === "N") return "necrotic"
	if (damagetype === "R") return "radiant"
	return false;
}

function parseproperty (property) {
	if (property === "A") return "ammunition"
	if (property === "LD") return "loading"
	if (property === "L") return "light"
	if (property === "F") return "finesse"
	if (property === "T") return "thrown"
	if (property === "H") return "heavy"
	if (property === "R") return "reach"
	if (property === "2H") return "two-handed"
	if (property === "V") return "versatile"
	if (property === "S") return "special"
	if (property === "RLD") return "reload"
	if (property === "BF") return "burst fire"
	return "n/a"
}

function tagcontent (curitem, tag, multi=false) {
	if (!curitem.getElementsByTagName(tag).length) return false;
	return curitem.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}

window.onload = loaditems;

var mundanelist;
var magiclist;
function loaditems() {
	tabledefault = $("#stats").html();

	var itemlist = itemdata.compendium.item;

	for (var i = 0; i < itemlist.length; i++) {

		var curitem = itemlist[i];
		var name = curitem.name;

		var type = curitem.type.split(",");
		if (type[0] === "$") continue;

		for (var j = 0; j < type.length; j++) {
			type[j] = parsetype (type[j]);
				if (!$("select.typefilter:contains(\""+type[j]+"\")").length) {
					$("select.typefilter").append("<option value='"+type[j]+"'>"+type[j]+"</option>")
				}
		}

		var source = curitem.text[curitem.text.length-1].split(",")[0].split(":")[1];

		var rarity = curitem.rarity;
		if (!rarity) {
			rarity = "None";
		} else rarity = rarity.replace("Rarity: ", "");

		var destinationlist = "ul.list.mundane";
		curitemstring = JSON.stringify (curitem)
		if (curitem.rarity || type.indexOf("W") !== -1 || curitemstring.search(/((magic)|(Devastation Orb)|(Storm Boomerang)|(\s?Spiked Armor\s?)|(Requires Attunement)|(Bottled Breath))/g) !== -1) {
			destinationlist = "ul.list.magic";
		}


		$(destinationlist).append("<li id='"+i+"' data-link=\""+encodeURIComponent(name).replace("'","%27")+"\"><span class='name col-xs-4'>"+name+"</span> <span class='type col-xs-3'>"+type.join(", ")+"</span> <span class='sourcename col-xs-2' title=\""+source+"\"><span class='source'>"+parsesource(source)+"</span></span> <span class='rarity col-xs-3'>"+rarity+"</span></li>");

		if (!$("select.sourcefilter option[value='"+parsesource(source)+"']").length) {
			$("select.sourcefilter").append("<option title=\""+source+"\" value='"+parsesource(source)+"'>"+source+"</option>")
		}
	}

	var options = {
		valueNames: ['name', 'source', 'type', 'rarity'],
		listClass: "mundane"
	}

	mundanelist = new List("itemcontainer", options);
	options.listClass = "magic";
	magiclist = new List("itemcontainer", options);

	$("ul.list li").mousedown(function(e) {
		if (e.which === 2) {
			console.log("#"+$(this).attr("data-link"))
			window.open("#"+$(this).attr("data-link"), "_blank").focus();
			e.preventDefault();
			e.stopPropagation();
			return;
		}
	});

	$("ul.list li").click(function(e) {
		useitem($(this).attr("id"));
		document.title = decodeURIComponent($(this).attr("data-link")).replace("%27","'") + " - 5etools Items";
		window.location = "#"+$(this).attr("data-link");
	});

	$(".typefilter option").sort(asc_sort).appendTo(".typefilter");
	$("select.typefilter option[value=All]").prependTo(".typefilter");
	$(".typefilter").val("All");

	if (window.location.hash.length) {
		$("ul.list li[data-link='"+window.location.hash.split("#")[1]+"']:eq(0)").click();
	} else $("ul.list li:eq(0)").click();

	$("form#filtertools select").change(function(){
		var typefilter = $("select.typefilter").val();
		var sourcefilter = $("select.sourcefilter").val().replace(" ","");
		var rarityfilter = $("select.rarityfilter").val();


		mundanelist.filter(function(item) {
			var righttype = false;
			var rightsource = false;
			var rightrarity = false;
			if (typefilter === "All" || item.values().type.indexOf(typefilter) !== -1) righttype = true;
			if (sourcefilter === "All" || item.values().source === "("+sourcefilter+")" || item.values().source === sourcefilter.replace(" ","")) rightsource = true;
			if (rarityfilter === "All" || item.values().rarity === rarityfilter) rightrarity = true;
			if (righttype && rightsource && rightrarity) return true;
			return false;
		});

		magiclist.filter(function(item) {
			var righttype = false;
			var rightsource = false;
			var rightrarity = false;
			if (typefilter === "All" || item.values().type.indexOf(typefilter) !== -1) righttype = true;
			if (sourcefilter === "All" || item.values().source === "("+sourcefilter+")" || item.values().source === sourcefilter.replace(" ","")) rightsource = true;
			if (rarityfilter === "All" || item.values().rarity === rarityfilter) rightrarity = true;
			if (righttype && rightsource && rightrarity) return true;
			return false;
		});

	});


	$("#filtertools button.sort").on("click", function() {
		if ($(this).attr("sortby") === "asc") {
			$(this).attr("sortby", "desc");
		} else $(this).attr("sortby", "asc");
		magiclist.sort($(this).attr("sort"), { order: $(this).attr("sortby"), sortFunction: sortitems });
		mundanelist.sort($(this).attr("sort"), { order: $(this).attr("sortby"), sortFunction: sortitems });
	});

	$("#itemcontainer h3").not(":has(input)").click(function() {
			if ($(this).next("ul.list").css("max-height") === "500px") {
					$(this).siblings("ul.list").animate({
						maxHeight: "250px",
						display: "block"
					});
					return;
				}

		$(this).next("ul.list").animate({
			maxHeight: "500px",
			display: "block"
		}).siblings("ul.list").animate({
			maxHeight: "0",
			display: "none"
		})

	})

		// reset button
		$("button#reset").click(function() {
			$("#filtertools select").val("All");
			$("#search").val("");
			magiclist.search("");
			magiclist.filter();
			magiclist.sort("name");
			magiclist.update();
			mundanelist.search("");
			mundanelist.filter();
			mundanelist.sort("name");
			mundanelist.update();
		})
}

function asc_sort(a, b){
	return ($(b).text()) < ($(a).text()) ? 1 : -1;
}

function desc_sort(a, b){
	return ($(b).text()) > ($(a).text()) ? 1 : -1;
}

function sortitems(a, b, o) {
	if (o.valueName === "name") {
		return ((b._values.name.toLowerCase()) > (a._values.name.toLowerCase())) ? 1 : -1;
	}

	if (o.valueName === "type") {
		return ((b._values.type.toLowerCase()) > (a._values.type.toLowerCase())) ? 1 : -1;
	}

	if (o.valueName === "source") {
		return ((b._values.source.toLowerCase()) > (a._values.source.toLowerCase())) ? 1 : -1;
	}

	if (o.valueName === "rarity") {
		ararity = a._values.rarity.replace("Rarity: ", "")
		brarity = b._values.rarity.replace("Rarity: ", "")
		if (ararity === "None") ararity = "0";
		if (brarity === "None") brarity = "0";
		if (ararity === "Common") ararity = "1";
		if (brarity === "Common") brarity = "1";
		if (ararity === "Uncommon") ararity = "2";
		if (brarity === "Uncommon") brarity = "2";
		if (ararity === "Rare") ararity = "3";
		if (brarity === "Rare") brarity = "3";
		if (ararity === "Very Rare") ararity = "4";
		if (brarity === "Very Rare") brarity = "4";
		if (ararity === "Legendary") ararity = "5";
		if (brarity === "Legendary") brarity = "5";
		if (ararity === "Artifact") ararity = "6";
		if (brarity === "Artifact") brarity = "6";
		return ((b._values.rarity) > (a._values.rarity)) ? 1 : -1;
	}

	return 1;

}

function useitem (id) {
	$("#currentitem").html(tabledefault);
	var itemlist = itemdata.compendium.item;
	var curitem = itemlist[id];

	var name = curitem.name;
	var source = (curitem.source) ? curitem.source : curitem.text[curitem.text.length-1].split(",")[0].split(":")[1];

	sourceshort = parsesource(source);
	$("th#name").html("<span title=\""+source+"\" class='source source"+sourceshort+"'>"+sourceshort+"</span> "+name);

	$("td span#type").html("")
	$("span#damage").html("");
	$("span#damagetype").html("");
	var type = curitem.type.split(",");

	for (var n = 0; n < type.length; n++) {
		var curtype = type[n];
		if (n > 0) $("td span#type").append (", ");
		$("td span#type").append(parsetype(curtype));
		if (curtype === "M" || curtype === "R" || curtype === "GUN") {
			$("span#damage").html(curitem.dmg1);
			$("span#damagetype").html(parsedamagetype(curitem.dmgType));
		}

		if (curtype === "S") $("span#damage").html("AC +"+curitem.ac);
		if (curtype === "LA") $("span#damage").html("AC "+curitem.ac+" + Dex");
		if (curtype === "MA") $("span#damage").html("AC "+curitem.ac+" + Dex (max 2)");
		if (curtype === "HA") $("span#damage").html("AC "+curitem.ac);
	}

	$("td span#rarity").html("")
	var rarity = curitem.rarity;
	if (rarity)	$("td span#rarity").html(", "+rarity);



	$("span#properties").html("");
	if (curitem.property) {
		var properties = curitem.property.split(",");
		$("span#damagetype").append(" - ");
		for (var i = 0; i < properties.length; i++) {
			var a = b = properties[i];
			a = parseproperty (a);
			if (b === "V") a = a + " (" + curitem.dmg2 + ")";
			if (b === "T" || b === "A") a = a + " (" + curitem.range + "ft.)";
			if (b === "RLD") a = a + " (" + curitem.reload + " shots)";
			if (i > 0) a = ", "+a;
			$("span#properties").append(a);
		}
	}

	$("span#value").html("");
	$("span#weight").html("");
	if (curitem.value) {
		var value = curitem.value;
		if (curitem.weight) value = value + ", ";
		$("td span#value").html(value);
	} else $("td span#value").html("");

	if (curitem.weight) {
		var weight = curitem.weight;
		if (weight == 1) {
			$("td span#weight").html(weight+" lb.");
		} else $("td span#weight").html(weight+" lbs.");
	} else $("td span#weight").html("");

	var textlist = curitem.text;
	$("tr.text").remove();
	var texthtml = "";
	$("td span#attunement").html("")
	for (var n = 0; n < textlist.length; n++) {
		if (!textlist[n]) continue;
		var curtextstring = JSON.stringify (textlist[n]);
		if (curtextstring.indexOf("Requires Attunement") !== -1) {
			$("td span#attunement").html("("+textlist[n]+")");
			continue;
		}
		if (textlist[n].indexOf(", common") > 0) continue;
		if (textlist[n].indexOf(", uncommon") > 0) continue;
		if (textlist[n].indexOf(", rare") > 0) continue;
		if (textlist[n].indexOf(", very rare") > 0) continue;
		if (textlist[n].indexOf(", legendary") > 0) continue;
		if (textlist[n].indexOf("(requires attunement)") > 0) continue;
		if (textlist[n].split("Rarity:")[1]) continue;
		if (textlist[n].split("Source:")[1]) {
			$("td#source span").html(textlist[n].split("Source:")[1]);
			continue;
		}

		var finaltext = textlist[n].replace(/(Curse|Sentience|Personality)(\.|\:) /g, '<strong>$1.</strong> ');
		texthtml = texthtml + "<p>"+finaltext+"</p>";
	}

	$("tr#text").after("<tr class='text'><td colspan='6' class='text"+i+"'>"+texthtml+"</td></tr>");

};
