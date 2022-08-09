/** @param {NS} ns **/
export async function main(ns) {

	ns.clearLog();
	ns.disableLog("ALL");
	ns.tail();
	ns.print("Now running Zprogram by u/DryFacade");
	ns.print(" ");
	ns.print('Please note: if the calculated time between each script is extremely brief, looking at the UI of the "Active scripts" tab to the left as well as running more than one instance of Zprogram may occasionally cause scripts to misalign temporarily.');
	ns.print(" ");

	// ALTER THESE IF NEEDED:
	// constants that act as limiters and that may be configured for performance needs:
	const unitime = 10; // the universal minimum time between script executions in milliseconds (raise if scripts misalign).
	const maxscripts = 9000; // the maximum # of scripts that Zprogram is allowed to produce (lower this if game crashes).

	const maxinstances = Math.floor(maxscripts / 3);
	const gscr = ns.getServerMaxRam(ns.args[1]) - ns.getServerUsedRam(ns.args[1]);

	// this block determines the most profitable server to hack (unless manually inputted).
	if (ns.args[0] == "best") {
		var serverarray = [
			"n00dles",
			"foodnstuff",
			"sigma-cosmetics",
			"joesguns",
			"hong-fang-tea",
			"harakiri-sushi",
			"iron-gym",
			"darkweb",
			"max-hardware",
			"zer0",
			"nectar-net",
			"CSEC",
			"neo-net",
			"phantasy",
			"omega-net",
			"silver-helix",
			"the-hub",
			"netlink",
			"johnson-ortho",
			"avmnite-02h",
			"computek",
			"crush-fitness",
			"catalyst",
			"syscore",
			"I.I.I.I",
			"rothman-uni",
			"summit-uni",
			"zb-institute",
			"lexo-corp",
			"alpha-ent",
			"millenium-fitness",
			"rho-construction",
			"aevum-police",
			"galactic-cyber",
			"aerocorp",
			"global-pharm",
			"snap-fitness",
			"omnia",
			"unitalife",
			"deltaone",
			"defcomm",
			"solaris",
			"icarus",
			"univ-energy",
			"zeus-med",
			"infocomm",
			"taiyang-digital",
			"zb-def",
			"nova-med",
			"titan-labs",
			"applied-energetics",
			"microdyne",
			"run4theh111z",
			"fulcrumtech",
			"stormtech",
			"helios",
			"vitalife",
			"kuai-gong",
			".",
			"omnitek",
			"4sigma",
			"clarkinc",
			"powerhouse-fitness",
			"b-and-a",
			"blade",
			"nwo",
			"ecorp",
			"megacorp",
			"fulcrumassets",
			"The-Cave",
		];
		var arraylength = serverarray.length;
		var bestserver = 0;
		for (var i = 0; i < arraylength; i++) {
			await ns.sleep(0);
			var reqhacklvl = ns.getServerRequiredHackingLevel(serverarray[i]);
			var minseclvl = ns.getServerMinSecurityLevel(serverarray[i]);
			var getseclvl = ns.getServerSecurityLevel(serverarray[i]);
			var hacktime = ns.getHackTime(serverarray[i]);
			var hacklvl = ns.getHackingLevel(serverarray[i]);
			var hackchance = ns.hackAnalyzeChance(serverarray[i]);
			var bestweakentime = ((reqhacklvl * minseclvl * 2.5 + 500) /
				(reqhacklvl * getseclvl * 2.5 + 500)) * hacktime * 4;
			var percenta = (100 - minseclvl) / 100;
			var percentb = (100 - getseclvl) / 100;
			var percentc = 1.75 * hacklvl;
			var percentd = reqhacklvl;
			var percente = hackchance;
			var percentf = percenta * (percentc - percentd) / percentc;
			var percentg = percentb * (percentc - percentd) / percentc;
			var percenth = percente * percentf / percentg;
			var percent = calculatepercent(serverarray[i], 0);
			var preinstances = calculatepercent(serverarray[i], 1);
			var h = hackanalyze(percent);
			var g = growthanalyze(percent);
			var w = (0.004 * Math.ceil(g * 1.05) + 0.002 * Math.floor(h)) / 0.05;
			var wthreads = Math.ceil(w + 1);
			var gthreads = Math.ceil(g * 1.05);
			var hthreads = Math.floor(h);
			if (percenth > 1) {
				var bestpercent = 1;
			} else if (percenth < 0) {
				var bestpercent = 0;
			} else {
				var bestpercent = percenth;
			}
			if (bestserver <= percent * bestpercent * ns.getServerMaxMoney(serverarray[i]) *
				preinstances / (bestweakentime * (21 / 16)) &&
				ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverarray[i])) {
				var bestserver = percent * bestpercent * ns.getServerMaxMoney(serverarray[i]) *
					preinstances / (bestweakentime * (21 / 16))
				var target = serverarray[i];
			}
		}
		ns.print("Most profitable server identified: ", target);
	} else {
		var target = ns.args[0];
	}

	// this block makes sure the server has root access and if not, next best server is selected.
	if (ns.hasRootAccess(target) == true) {
		ns.print("Root access to ", target, " has been verified.");
	} else {
		if (ns.fileExists("BruteSSH.exe", "home")) {
			ns.brutessh(target);
			var ssh = 1;
		} else {
			var ssh = 0;
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			ns.ftpcrack(target);
			var ftp = 1;
		} else {
			var ftp = 0;
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			ns.relaysmtp(target);
			var smtp = 1;
		} else {
			var smtp = 0;
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			ns.httpworm(target);
			var http = 1;
		} else {
			var http = 0;
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			ns.sqlinject(target);
			var sql = 1;
		} else {
			var sql = 0;
		}
		var totalports = ssh + ftp + smtp + http + sql
		if (ns.getServerNumPortsRequired(target) - totalports <= 0) {
			ns.nuke(target);
			ns.print("Gained root access to ", target, ".");
		} else {
			ns.print("Error: unable to gain root access. make sure you have the necessary programs to open ports for ", target, ".");
			if (ns.args[0] == "best") {
				var serverarray = [
					"n00dles",
					"foodnstuff",
					"sigma-cosmetics",
					"joesguns",
					"hong-fang-tea",
					"harakiri-sushi",
					"iron-gym",
					"darkweb",
					"max-hardware",
					"zer0",
					"nectar-net",
					"CSEC",
					"neo-net",
					"phantasy",
					"omega-net",
					"silver-helix",
					"the-hub",
					"netlink",
					"johnson-ortho",
					"avmnite-02h",
					"computek",
					"crush-fitness",
					"catalyst",
					"syscore",
					"I.I.I.I",
					"rothman-uni",
					"summit-uni",
					"zb-institute",
					"lexo-corp",
					"alpha-ent",
					"millenium-fitness",
					"rho-construction",
					"aevum-police",
					"galactic-cyber",
					"aerocorp",
					"global-pharm",
					"snap-fitness",
					"omnia",
					"unitalife",
					"deltaone",
					"defcomm",
					"solaris",
					"icarus",
					"univ-energy",
					"zeus-med",
					"infocomm",
					"taiyang-digital",
					"zb-def",
					"nova-med",
					"titan-labs",
					"applied-energetics",
					"microdyne",
					"run4theh111z",
					"fulcrumtech",
					"stormtech",
					"helios",
					"vitalife",
					"kuai-gong",
					".",
					"omnitek",
					"4sigma",
					"clarkinc",
					"powerhouse-fitness",
					"b-and-a",
					"blade",
					"nwo",
					"ecorp",
					"megacorp",
					"fulcrumassets",
					"The-Cave",
				];
				var arraylength = serverarray.length;
				var bestserver = 0;
				for (var i = 0; i < arraylength; i++) {
					await ns.sleep(0);
					var reqhacklvl = ns.getServerRequiredHackingLevel(serverarray[i]);
					var minseclvl = ns.getServerMinSecurityLevel(serverarray[i]);
					var getseclvl = ns.getServerSecurityLevel(serverarray[i]);
					var hacktime = ns.getHackTime(serverarray[i]);
					var hacklvl = ns.getHackingLevel(serverarray[i]);
					var hackchance = ns.hackAnalyzeChance(serverarray[i]);
					var bestweakentime = ((reqhacklvl * minseclvl * 2.5 + 500) /
						(reqhacklvl * getseclvl * 2.5 + 500)) * hacktime * 4;
					var percenta = (100 - minseclvl) / 100;
					var percentb = (100 - getseclvl) / 100;
					var percentc = 1.75 * hacklvl;
					var percentd = reqhacklvl;
					var percente = hackchance;
					var percentf = percenta * (percentc - percentd) / percentc;
					var percentg = percentb * (percentc - percentd) / percentc;
					var percenth = percente * percentf / percentg;
					var percent = calculatepercent(serverarray[i], 0);
					var preinstances = calculatepercent(serverarray[i], 1);
					var h = hackanalyze(percent);
					var g = growthanalyze(percent);
					var w = (0.004 * Math.ceil(g * 1.05) + 0.002 * Math.floor(h)) / 0.05;
					var wthreads = Math.ceil(w + 1);
					var gthreads = Math.ceil(g * 1.05);
					var hthreads = Math.floor(h);
					var hackthreadratio = 1.7 * hthreads / (1.7 * hthreads + 1.75 * gthreads + 1.75 * wthreads);
					if (percenth > 1) {
						var bestpercent = 1;
					} else if (percenth < 0) {
						var bestpercent = 0;
					} else {
						var bestpercent = percenth;
					}
					if (bestserver <= percent * bestpercent * ns.getServerMaxMoney(serverarray[i]) *
						preinstances / (bestweakentime * (21 / 16)) &&
						ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverarray[i]) &&
						ns.getServerNumPortsRequired(serverarray[i]) <= totalportexe(serverarray[i])) {
						var bestserver = percent * bestpercent * ns.getServerMaxMoney(serverarray[i]) *
							preinstances / (bestweakentime * (21 / 16))
						var target = serverarray[i];
					}
				}
				ns.print("Next best server available: ", target);
				if (ns.hasRootAccess(target) == true) {
					ns.print("Root access to ", target, " has been verified.");
				} else {
					if (ns.fileExists("BruteSSH.exe", "home")) {
						ns.brutessh(target);
					}
					if (ns.fileExists("FTPCrack.exe", "home")) {
						ns.ftpcrack(target);
					}
					if (ns.fileExists("relaySMTP.exe", "home")) {
						ns.relaysmtp(target);
					}
					if (ns.fileExists("HTTPWorm.exe", "home")) {
						ns.httpworm(target);
					}
					if (ns.fileExists("SQLInject.exe", "home")) {
						ns.sqlinject(target);
					}
					ns.nuke(target);
					ns.print("Gained root access to ", target, ".");
				}
			} else {
				var target = ns.args[0];
			}
		}
		await ns.sleep(100);
	}

	// this block copy/pastes the necessary scripts to the host server.
	var go = `/** @param {NS} ns */
export async function main(ns) {
	await ns.grow(ns.args[0]);
}`;
	await ns.write("growonce.js", go, "w");
	var wo = `/** @param {NS} ns */
export async function main(ns) {
	await ns.weaken(ns.args[0]);
}`;
	await ns.write("weakenonce.js", wo, "w");
	var hstr = `/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(ns.args[1]);
	await ns.hack(ns.args[0]);
}`;
	await ns.write("zhack.js", hstr, "w");
	var gstr = `/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(ns.args[1]);
	await ns.grow(ns.args[0]);
}`;
	await ns.write("zgrow.js", gstr, "w");
	var wstr = `/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(0);
	await ns.weaken(ns.args[0]);
}`;
	await ns.write("zweaken.js", wstr, "w");
	var files = [
		"growonce.js",
		"weakenonce.js",
		"zhack.js",
		"zgrow.js",
		"zweaken.js",
	];
	await ns.scp(files, "home", ns.args[1]);
	ns.print("Copy/pasted necessary files to host server.");

	// this block ensures the target server is weakened to minimum
	// and the server's money is at max before beginning the hacking cycle.
	while (true) {
		ns.print("Verifying that target server is prepped...");
		do {
			var gsmm = ns.getServerMaxMoney(target);
			var gsma = ns.getServerMoneyAvailable(target);
			var gssl = ns.getServerSecurityLevel(target);
			var gsmsl = ns.getServerMinSecurityLevel(target);
			var sslr = gssl - gsmsl;//security level to be removed
			var sslt = sslr / 0.05;//weaken threads to remove sslr
			var gmulti = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
			var ga = ns.growthAnalyze(target, gmulti, 1);//grow threads
			var gsi = (ga * 0.004) / 0.05 + 2;//additional weaken threads from grow threads
			var gagsi = (ga + gsi) * 1.75;//grow (and consequential weaken) RAM usage
			var gwratio = gscr / gagsi;
			if (gssl > gsmsl) {
				ns.print("Target server requires prepping. Now initializing a grow/weaken protocol.");
				if (gsmm > gsma) {
					if (Math.ceil(sslt * 1.75) + Math.ceil(gagsi) < gscr) {
						var protocol = "protocol 1";
						ns.exec("growonce.js", ns.args[1], Math.ceil(ga), target);
						ns.exec("weakenonce.js", ns.args[1], Math.ceil(gsi + sslt), target);
					} else if (Math.ceil(sslt * 1.75 + 1.75) < gscr) {
						var protocol = "protocol 2";
						ns.exec("growonce.js", ns.args[1], Math.floor(gscr / 1.75 - sslt - (0.004 * (gscr / 1.75 - sslt) / 0.05)) - 1, target);
						ns.exec("weakenonce.js", ns.args[1], Math.floor(sslt + (0.004 * (gscr / 1.75 - sslt) / 0.05)) + 1, target);
					} else {
						var protocol = "protocol 3";
						ns.exec("weakenonce.js", ns.args[1], Math.floor(gscr / 1.75), target);
					}
				} else {
					var protocol = "protocol 4";
					ns.exec("weakenonce.js", ns.args[1], Math.ceil(sslt), target);
				}
			} else if (gsmm > gsma) {
				ns.print("Target server requires prepping. Now initializing a grow/weaken protocol.");
				if (Math.ceil(gagsi) < gscr) {
					var protocol = "protocol 5";
					ns.exec("growonce.js", ns.args[1], Math.ceil(ga), target);
					ns.exec("weakenonce.js", ns.args[1], Math.ceil(gsi), target);
				} else {
					var protocol = "protocol 6";
					ns.exec("growonce.js", ns.args[1], Math.floor(ga * gwratio) - 1, target);
					ns.exec("weakenonce.js", ns.args[1], Math.floor(gsi * gwratio) + 1, target);
				}
			}
			if (gssl > gsmsl || gsmm > gsma) {
				ns.print(protocol, " will take ", Math.round(ns.getWeakenTime(target) + 1000) / 1000, " seconds. Multiple instances may be looped...");
				await ns.sleep(ns.getWeakenTime(target) + 1000);
			} else {
				ns.print("Target server is prepped.");
			}
		} while (gssl > gsmsl || gsmm > gsma)

		// this block calculates the optimal percentage of money to hack and calculates important variables.
		for (var i = 1; i < 100; i++) {
			var percent = i / 100;
			var h = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * percent);
			var g = ns.growthAnalyze(target, 1 / (1 - percent), 1);
			var w = (0.004 * Math.ceil(g * 1.05) + 0.002 * Math.floor(h)) / 0.05;
			var wtime = ns.getWeakenTime(target);
			var wthreads = Math.ceil(w + 1);
			var gthreads = Math.ceil(g * 1.05);
			var hthreads = Math.floor(h);
			var ph = 1.7 * hthreads;
			var pg = 1.75 * gthreads;
			var pw = 1.75 * wthreads;
			var packet = ph + pg + pw;
			var rawinstances = gscr / packet;
			var instances = Math.floor(rawinstances);
			var itime = wtime / instances;
			var itime3 = itime / 16;
			if (itime3 > unitime && instances < maxinstances && percent < 0.99) {
				break;
			}
		}
		if (instances <= 0) {
			var packet = 0
			for (var i = 1; i < 1 / 0; i++) {
				if (packet > gscr) {
					var percent = ns.hackAnalyze(target) * (i - 2);
					var breaktime = true
				} else {
					var percent = ns.hackAnalyze(target) * i;
				}
				var h = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * percent);
				var g = ns.growthAnalyze(target, 1 / (1 - percent), 1);
				var w = (0.004 * Math.ceil(g) + 0.002 * Math.floor(h)) / 0.05;
				var wtime = ns.getWeakenTime(target);
				var wthreads = Math.ceil(w);
				var gthreads = Math.ceil(g);
				var hthreads = Math.floor(h);
				var ph = 1.7 * hthreads;
				var pg = 1.75 * gthreads;
				var pw = 1.75 * wthreads;
				var packet = ph + pg + pw;
				var rawinstances = gscr / packet;
				var instances = Math.floor(rawinstances);
				var itime = wtime / instances;
				var itime3 = itime / 16;
				if (breaktime == true) {
					break;
				} else if (packet >= gscr && i == 1) {
					ns.print("There is not enough server RAM to run this script with target set as ", target, ". Now terminating Zprogram...")
					ns.exit()
				}
			}
		}
		ns.print("Hacking ", target, " at ", Math.round(percent * 10000000) / 100000, "% total server money.");

		// this block calculates both time between scripts and total instances.
		if (itime3 > unitime && instances < maxinstances) {
			var inst2 = instances;
			var i3time = itime3;
		} else if (itime3 > unitime && instances >= maxinstances) {
			var inst2 = maxinstances;
			var i3time = itime3;
		} else if (itime3 <= unitime && instances < maxinstances) {
			var inst2 = Math.floor(rawinstances * itime3 / unitime);
			var i3time = unitime;
		} else if (instances * itime3 / unitime < maxinstances) {
			var inst2 = Math.floor(rawinstances * itime3 / unitime);
			var i3time = unitime;
		} else {
			var inst2 = maxinstances;
			var i3time = unitime;
		}
		if (percent <= 0.01) {
			ns.print("Total scripts to be run: ", inst2 * 3, ".");
		} else {
			ns.print("Total scripts to be run: ", inst2 * 3 - 1, ".");
		}
		ns.print("Time between each script: ", Math.round(i3time * 1000) / 1000, "ms.");

		// this block executes all of the calulated hack, grow, and weaken scripts in a for() loop
		var htime = ns.getHackTime(target);
		var gtime = ns.getGrowTime(target);
		var sleep1 = wtime - htime;
		var sleep2 = wtime - gtime;
		ns.print("Now initializing hack/grow/weaken chain. This process will take ", Math.round(i3time * inst2 * 3) / 1000, " seconds.");
		if (percent <= 0.01) {
			for (var i = 0; i < inst2; i++) {
				ns.exec("zhack.js", ns.args[1], hthreads, target, sleep1, i);
				await ns.sleep(i3time);
				ns.exec("zgrow.js", ns.args[1], gthreads, target, sleep2, i);
				await ns.sleep(i3time);
				ns.exec("zweaken.js", ns.args[1], wthreads, target, i);
				await ns.sleep(i3time);
			}
		} else {
			for (var i = 0; i < inst2 - 1; i++) {
				ns.exec("zhack.js", ns.args[1], hthreads, target, sleep1, i);
				await ns.sleep(i3time);
				ns.exec("zgrow.js", ns.args[1], gthreads, target, sleep2, i);
				await ns.sleep(i3time);
				ns.exec("zweaken.js", ns.args[1], wthreads, target, i);
				await ns.sleep(i3time);
			}
			ns.exec("zgrow.js", ns.args[1], gthreads, target, sleep2, i);
			await ns.sleep(i3time);
			ns.exec("zweaken.js", ns.args[1], wthreads + hthreads, target, i);
			await ns.sleep(i3time * 2);
		}
		ns.print("Done. Scripts will start executing in ", Math.round(wtime - i3time * inst2 * 3) / 1000, " seconds and will finish in ", Math.round(wtime) / 1000, " seconds.");
		await ns.sleep(wtime * 1.015);

		// this block displays script's income on the log.
		ns.print("Renewing instances...");
		ns.print(" ");
		var moneysec = ns.getScriptIncome(ns.getScriptName(), ns.getHostname(), ns.args[0], ns.args[1]);
		if (moneysec < 1000) {
			ns.print("Average moneyflow: $", Math.round(moneysec * 1000) / 1000, " / sec.");
		} else if (moneysec < 1000000) {
			ns.print("Average moneyflow: $", Math.round(moneysec) / 1000, "k / sec.");
		} else if (moneysec < 1000000000) {
			ns.print("Average moneyflow: $", Math.round(moneysec / 1000) / 1000, "m / sec.");
		} else if (moneysec < 1000000000000) {
			ns.print("Average moneyflow: $", Math.round(moneysec / 1000000) / 1000, "b / sec.");
		} else {
			ns.print("Average moneyflow: $", Math.round(moneysec / 1000000000) / 1000, "t / sec.");
		}
	}


	// Functions:
	function totalportexe(target) {
		if (ns.fileExists("BruteSSH.exe", "home")) {
			ns.brutessh(target);
			var ssh = 1;
		} else {
			var ssh = 0;
		}
		if (ns.fileExists("FTPCrack.exe", "home")) {
			ns.ftpcrack(target);
			var ftp = 1;
		} else {
			var ftp = 0;
		}
		if (ns.fileExists("relaySMTP.exe", "home")) {
			ns.relaysmtp(target);
			var smtp = 1;
		} else {
			var smtp = 0;
		}
		if (ns.fileExists("HTTPWorm.exe", "home")) {
			ns.httpworm(target);
			var http = 1;
		} else {
			var http = 0;
		}
		if (ns.fileExists("SQLInject.exe", "home")) {
			ns.sqlinject(target);
			var sql = 1;
		} else {
			var sql = 0;
		}
		return ssh + ftp + smtp + http + sql
	}

	function hackanalyze(percent) {
		return ns.getServerMaxMoney(serverarray[i]) * percent / (ns.getServerMaxMoney(serverarray[i]) *
			ns.hackAnalyze(serverarray[i]) * ((100 - ns.getServerMinSecurityLevel(serverarray[i])) /
				(100 - ns.getServerSecurityLevel(serverarray[i]))));
	}

	function growthanalyze(percent) {
		var growthp = 1 / (1 - percent);
		var serverGrowthPercentage = ns.getServerGrowth(serverarray[i]) / 100;
		var ajdGrowthRatebit = 1 + (1.03 - 1) / ns.getServerSecurityLevel(serverarray[i]);
		if (ajdGrowthRatebit > 1.0035) {
			ajdGrowthRatebit = 1.0035;
		}
		var ajdGrowthRate = 1 + (1.03 - 1) / ns.getServerMinSecurityLevel(serverarray[i]);
		if (ajdGrowthRate > 1.0035) {
			ajdGrowthRate = 1.0035;
		}
		var bitnode = (Math.log(growthp) / (Math.log(ajdGrowthRatebit) *
			ns.getHackingMultipliers(serverarray[i]).growth *
			(serverGrowthPercentage))) / ns.growthAnalyze(serverarray[i], growthp);
		return Math.log(growthp) / (Math.log(ajdGrowthRate) *
			ns.getHackingMultipliers(serverarray[i]).growth *
			(serverGrowthPercentage) * bitnode);
	}

	function hackPercentPerThreads(threads) {
		var growthp = 1 / (1 - percent);
		var serverGrowthPercentage = ns.getServerGrowth(serverarray[i]) / 100;
		var ajdGrowthRatebit = 1 + (1.03 - 1) / ns.getServerSecurityLevel(serverarray[i]);
		if (ajdGrowthRatebit > 1.0035) {
			ajdGrowthRatebit = 1.0035;
		}
		var ajdGrowthRate = 1 + (1.03 - 1) / ns.getServerMinSecurityLevel(serverarray[i]);
		if (ajdGrowthRate > 1.0035) {
			ajdGrowthRate = 1.0035;
		}
		var bitnode = (Math.log(growthp) / (Math.log(ajdGrowthRatebit) *
			ns.getHackingMultipliers(serverarray[i]).growth *
			(serverGrowthPercentage))) / ns.growthAnalyze(serverarray[i], growthp);
		return 1 - 1 / (10 ** (threads * Math.log10(1.0035) * ns.getHackingMultipliers(serverarray[i]).growth *
			serverGrowthPercentage * bitnode));
	}

	function calculatepercent(target, whatinstances) {
		for (var i = 1; i < 100; i++) {
			var percentp = i / 100;
			var h = hackanalyze(percentp);
			var g = growthanalyze(percentp);
			var w = (0.004 * Math.ceil(g * 1.05) + 0.002 * Math.floor(h)) / 0.05;
			var wtime = bestweakentime;
			var wthreads = Math.ceil(w + 1);
			var gthreads = Math.ceil(g * 1.05);
			var hthreads = Math.floor(h);
			var ph = 1.7 * hthreads;
			var pg = 1.75 * gthreads;
			var pw = 1.75 * wthreads;
			var packet = ph + pg + pw;
			var rawinstances = gscr / packet;
			var instances = Math.floor(rawinstances);
			var itime = wtime / instances;
			var itime3 = itime / 16;
			if (itime3 > unitime && instances < maxinstances && percentp < 0.99) {
				break;
			}
		}
		if (instances <= 0) {
			var packet = 0
			for (var i = 1; i < 1 / 0; i++) {
				if (packet > gscr) {
					var percentp = hackPercentPerThreads(i - 2);
					var breaktime = true
				} else {
					var percentp = hackPercentPerThreads(i);
				}
				var h = hackanalyze(percentp);
				var g = growthanalyze(percentp);
				var w = (0.004 * Math.ceil(g) + 0.002 * Math.floor(h)) / 0.05;
				var wtime = bestweakentime;
				var wthreads = Math.ceil(w);
				var gthreads = Math.ceil(g);
				var hthreads = Math.floor(h);
				var ph = 1.7 * hthreads;
				var pg = 1.75 * gthreads;
				var pw = 1.75 * wthreads;
				var packet = ph + pg + pw;
				var rawinstances = gscr / packet;
				var instances = Math.floor(rawinstances);
				var itime = wtime / instances;
				var itime3 = itime / 16;
				if (breaktime == true) {
					break;
				} else if (packet >= gscr && i == 1) {
					break;
				}
			}
		}

		if (itime3 > unitime && instances < maxinstances) {
			var inst2 = instances;
		} else if (itime3 > unitime && instances >= maxinstances) {
			var inst2 = maxinstances;
		} else if (itime3 <= unitime && instances < maxinstances) {
			var inst2 = Math.floor(rawinstances * itime3 / unitime);
		} else if (instances * itime3 / unitime < maxinstances) {
			var inst2 = Math.floor(rawinstances * itime3 / unitime);
		} else {
			var inst2 = maxinstances;
		}

		if (whatinstances == 0) {
			return percentp;
		} else if (whatinstances == 1) {
			return inst2;
		}
	}
}
