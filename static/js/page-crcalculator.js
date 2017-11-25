

function parsesize (size) {
	if (size == "T") size = "Tiny";
	if (size == "S") size = "Small";
	if (size == "M") size = "Medium";
	if (size == "L") size = "Large";
	if (size == "H") size = "Huge";
	if (size == "G") size = "Gargantuan";
	return size;
}

var xpchart = [200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000, 20000, 22000, 25000, 30000, 41000, 50000, 62000, 75000, 90000, 105000, 102000, 135000, 155000]

window.onload = loadpage;

function loadpage() {
	for (var i = 0; i < msbcr.cr.length; i++) {
		var curcr = msbcr.cr[i];
		$("#msbcr").append("<tr><td>"+curcr._cr+"</td><td>"+curcr.pb+"</td><td>"+curcr.ac+"</td><td>"+curcr.hpmin+"-"+curcr.hpmax+"</td><td>"+curcr.attackbonus+"</td><td>"+curcr.dprmin+"-"+curcr.dprmax+"</td><td>"+curcr.savedc+"</td></tr>")
	}

	$("input#calculate").click(function() {
		calculatecr();
	})

	$("#crcalc input").change(function() {
		calculatecr();
	})

	$("#saveprofs, #resistances").change(function() {
		calculatecr();
	})

	$("#saveinstead").change(function() {
		var curval = parseInt($("#attackbonus").val());
		if (!$(this).is(":checked")) $("#attackbonus").val(curval-10);
		if ($(this).is(":checked")) $("#attackbonus").val(curval+10);
		calculatecr();
	});

	$("select#size").change(function() {
		var newsize = $(this).val();
		if (newsize == "Tiny") $("#hdval").html("d4")
		if (newsize == "Small") $("#hdval").html("d6")
		if (newsize == "Medium") $("#hdval").html("d8")
		if (newsize == "Large") $("#hdval").html("d10")
		if (newsize == "Huge") $("#hdval").html("d12")
		if (newsize == "Gargantuan") $("#hdval").html("d20")
		$("#hp").val(calculatehp());
		calculatecr();
	});

	$("#hd, #con").change(function() {
		$("#hp").val(calculatehp());
		calculatecr();
	})

	$("#msbcr tr").not(":has(th)").click(function() {
		$("#expectedcr").val($(this).children("td:eq(0)").html());
		var minhp = parseInt($(this).children("td:eq(3)").html().split("-")[0]);
		var maxhp = parseInt($(this).children("td:eq(3)").html().split("-")[1]);
		$("#hp").val(minhp + (maxhp - minhp) / 2)
		$("#hd").val(calculatehd());
		$("#ac").val($(this).children("td:eq(2)").html())
		$("#dpr").val($(this).children("td:eq(5)").html().split("-")[0])
		$("#attackbonus").val($(this).children("td:eq(4)").html())
		if ($("#saveinstead").is(":checked")) $("#attackbonus").val($(this).children("td:eq(6)").html())
		calculatecr();
	});

	$("#hp").change(function() {
		$("#hd").val(calculatehd());
		calculatecr();
	});

	// parse monsterfeatures
	for (var i = 0; i < monsterfeatures.length; i++) {
		var effectoncr = [];
		if (monsterfeatures[i].hp) effectoncr.push("HP: "+monsterfeatures[i].hp);
		if (monsterfeatures[i].ac) effectoncr.push("AC: "+monsterfeatures[i].ac);
		if (monsterfeatures[i].dpr) effectoncr.push("DPR: "+monsterfeatures[i].dpr);
		if (monsterfeatures[i].attackbonus) effectoncr.push("AB: "+monsterfeatures[i].attackbonus);

		effectoncr = effectoncr.join(", ");


		var numbox = "";
		if (monsterfeatures[i].numbox === "YES") numbox = "<input type='number' value='0'>"
		$("#monsterfeatures table").append("<tr><td><input type='checkbox' id='MF"+encodeURI(monsterfeatures[i].name)+"' data-hp='"+monsterfeatures[i].hp+"' data-ac='"+monsterfeatures[i].ac+"' data-dpr='"+monsterfeatures[i].dpr+"' data-attackbonus='"+monsterfeatures[i].attackbonus+"'>"+numbox+"</td><td>"+monsterfeatures[i].name+"</td><td>"+monsterfeatures[i].example+"</td><td>"+monsterfeatures[i].effect+"</td><td>"+effectoncr+"</td></tr>");

		$("#monsterfeatures tr td:last, #monsterfeatures tr th:last").hide();
	}

	// parse url
	function parseurl() {
	if (window.location.hash) {
		var curdata = window.location.hash.split("#")[1].split(",")
		$("#expectedcr").val(curdata[0])
		$("#hp").val(curdata[1]);
		$("#hp").val(calculatehp());
		$("#ac").val(curdata[2]);
		$("#dpr").val(curdata[3]);
		$("#attackbonus").val(curdata[4]);
		if (curdata[5] === "true") $("#saveinstead").attr("checked",true);
		$("#size").val(curdata[6])
		$("select#size").change();
		$("#hd").val(curdata[7])
		$("#con").val(curdata[8])
		$("#hp").val(calculatehp());
		if (curdata[9] === "true") $("#vulnerabilities").attr("checked",true);
		$("#resistances").val(curdata[10]);
		if (curdata[11] === "true") $("#flying").attr("checked",true);
		$("#saveprofs").val(curdata[12])

		if (window.location.hash.indexOf("traits:") !== -1) {
			curdata = window.location.hash.split("traits:")[1].split(",");
			for (var i = 1; i < curdata.length; i++) {
				$("input[id='"+curdata[i].split(":")[0]+"']").click();
				if (curdata[i].split(":")[1]) 	$("input[id='"+curdata[i].split(":")[0]+"']").siblings("input[type=number]").val(curdata[i].split(":")[1])
			}
		}

		calculatecr();
		}
	}

	// Monster Features table
	$("#monsterfeatures tr td").not(":has(input)").click(function() {
		$(this).siblings().children("input").click();

		var curfeature = $(this).siblings("td").children("input").attr("id");
		var curnumber="";
		if ($(this).siblings("td").children("input[type=number]").length) curnumber = ":"+$(this).siblings("td").children("input[type=number]").val();
		window.location = window.location.hash+","+curfeature+curnumber;

		if ($(this).siblings("td").children("input").prop("checked")) return;

		window.location = window.location.hash.split(","+curfeature+curnumber).join("");
		window.location = window.location.hash.split(","+curfeature+":0").join("");
		window.location = window.location.hash.split(","+curfeature).join("");
	})

	$("#monsterfeatures tr td input").change(function() {
		calculatecr();
	})

	$("#reset").click(function() {
			window.location = "";
			parseurl();
	})

	parseurl();
	calculatecr();
}

function calculatecr() {
	var expectedcr = parseInt($("#expectedcr").val());

	var hp = parseInt($("#crcalc #hp").val()) ;

	if ($("#resistances").val() === "res") {
			if (expectedcr >= 0 && expectedcr <= 4) hp *= 2;
			if (expectedcr >= 5 && expectedcr <= 10) hp *= 1.5;
			if (expectedcr >= 11 && expectedcr <= 16) hp *= 1.25;
	}
	if ($("#resistances").val() === "imm") {
			if (expectedcr >= 0 && expectedcr <= 4) hp *= 2;
			if (expectedcr >= 5 && expectedcr <= 10) hp *= 2;
			if (expectedcr >= 11 && expectedcr <= 16) hp *= 1.5;
			if (expectedcr >= 17) hp *= 1.25;
	}

	var ac = parseInt($("#crcalc #ac").val());
	ac += parseInt($("#saveprofs").val()) + parseInt($("#flying").prop("checked")*2);

	var dpr = parseInt($("#crcalc #dpr").val());

	var attackbonus = parseInt($("#crcalc #attackbonus").val());
	var usesavedc = $("#saveinstead").prop("checked");

	var offensiveCR = -1;
	var defensiveCR = -1;

	// go through monster features
	$("#monsterfeatures input:checked").each(function() {
		var trait = 0;
		if ($(this).siblings("input[type=number]").length) trait = $(this).siblings("input[type=number]").val();
		if ($(this).attr("data-hp") !== "") hp += eval($(this).attr("data-hp"));
		if ($(this).attr("data-ac") !== "") ac += eval($(this).attr("data-ac"));
		if ($(this).attr("data-dpr") !== "") dpr += eval($(this).attr("data-dpr"));
		if (!usesavedc && $(this).attr("data-attackbonus") !== "") attackbonus += parseInt($(this).attr("data-attackbonus"));
	})

	hp = Math.floor (hp);
	dpr = Math.floor (dpr);

	var effectivehp = hp;
	var effectivedpr = dpr;

	// make sure you don't break the CR
	if (hp > 850) hp = 850;
	if (dpr > 320) dpr = 320;

	for (var i = 0; i < msbcr.cr.length; i++) {
		var curcr = msbcr.cr[i];
		if (hp >= parseInt(curcr.hpmin) && hp <= parseInt(curcr.hpmax)) {
			var defensedifference = parseInt(curcr.ac) - ac;
			if (defensedifference > 0) defensedifference = Math.floor(defensedifference / 2);
			if (defensedifference < 0) defensedifference = Math.ceil(defensedifference / 2);
			defensedifference = i - defensedifference;
			if (defensedifference < 0) defensedifference = 0;
			if (defensedifference >= msbcr.cr.length) defensedifference = msbcr.cr.length-1;
			defensiveCR = msbcr.cr[defensedifference]._cr;
		}
		if (dpr >= curcr.dprmin && dpr <= curcr.dprmax) {
			var adjuster = parseInt(curcr.attackbonus);
			if (usesavedc) adjuster = parseInt(curcr.savedc);
			var attackdifference = adjuster - attackbonus;
			if (attackdifference > 0) attackdifference = Math.floor(attackdifference / 2);
			if (attackdifference < 0) attackdifference = Math.ceil(attackdifference / 2);
			attackdifference = i - attackdifference;
			if (attackdifference < 0) attackdifference = 0;
			if (attackdifference >= msbcr.cr.length) attackdifference = msbcr.cr.length-1;
			offensiveCR = msbcr.cr[attackdifference]._cr;
		}
	}


	var cr = ((eval(offensiveCR) + eval(defensiveCR)) / 2).toString();

	if (cr == "0.5625") cr = "1/2"
	if (cr == "0.5") cr = "1/2"
	if (cr == "0.375") cr = "1/4"
	if (cr == "0.3125") cr = "1/4"
	if (cr == "0.25") cr = "1/4"
	if (cr == "0.1875") cr = "1/8"
	if (cr == "0.125") cr = "1/8"
	if (cr == "0.0625") cr = "1/8"
	if (cr.indexOf(".") !== -1) cr = Math.round(cr).toString();

	var finalcr = 0;
	for (var i = 0; i < msbcr.cr.length; i++) {
		if (msbcr.cr[i]._cr === cr) {
			finalcr = i;
			break;
		}
	}

	var hitdice = calculatehd();
	var hitdicesize = $("#hdval").html();
	var conmod = Math.floor(($("#con").val() - 10) / 2);

	var hash = "#";
	hash += $("#expectedcr").val()+"," // 0
	hash += $("#hp").val()+"," // 1
	hash += $("#ac").val()+"," // 2
	hash += $("#dpr").val()+"," // 3
	hash += $("#attackbonus").val()+"," // 4
	hash += usesavedc+"," // 5
	hash += $("#size").val()+"," // 6
	hash += $("#hd").val()+"," // 7
	hash += $("#con").val()+"," // 8
	hash += $("#vulnerabilities").prop("checked")+"," // 9
	hash += $("#resistances").val()+"," // 10
	hash += $("#flying").prop("checked")+"," // 11
	hash += $("#saveprofs").val()+"," // 12
	hash += "traits:";
	var hastraits = window.location.hash.split("traits:")[1];
	if (hastraits !== "undefined") hash += hastraits;

	window.location = hash;

	$("#croutput").html("<h4>Challenge Rating: "+cr+"</h4>");
	$("#croutput").append("<p>Offensive CR: "+offensiveCR+"</p>");
	$("#croutput").append("<p>Defensive CR: "+defensiveCR+"</p>");
	$("#croutput").append("<p>Proficiency Bonus: +"+msbcr.cr[finalcr].pb+"</p>");
	$("#croutput").append("<p>Effective HP: "+effectivehp+" ("+hitdice+hitdicesize+(conmod<0?"":"+")+(conmod*hitdice)+")</p>");
	$("#croutput").append("<p>Effective AC: "+ac+"</p>");
	$("#croutput").append("<p>Average Damage Per Round: "+effectivedpr+"</p>");
	$("#croutput").append("<p>"+(usesavedc?"Save DC: ":"Effective Attack Bonus: +")+attackbonus+"</p>");
}

function calculatehd() {
	var avghp = $("#hdval").html().split("d")[1]/2+0.5;
	var conmod = Math.floor(($("#con").val() - 10) / 2);
	var curhd = Math.floor(parseInt($("#hp").val()) / (avghp + conmod));
	if (!curhd) curhd = 1;
	return curhd;
}

function calculatehp() {
	var avghp = $("#hdval").html().split("d")[1] / 2 + 0.5;
	var conmod = Math.floor(($("#con").val() - 10) / 2);
	return Math.round ((avghp + conmod) * $("#hd").val());
}
