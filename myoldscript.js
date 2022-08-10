/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint("Zprogram by u/DryFacade");

	// This segment makes sure the server has root access.
	ns.tail();
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(ns.args[0]);
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(ns.args[0]);
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(ns.args[0]);
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(ns.args[0]);
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(ns.args[0]);
	}
	ns.nuke(ns.args[0]);

	// This segment copy/pastes the necessary scripts to the host server.
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

	// This segment ensures the target server is weakened to minimum
	// and the server's money is at max before beginning the hacking cycle.
	while (true) {
		do {
			var gsmm = ns.getServerMaxMoney(ns.args[0]);
			var gsma = ns.getServerMoneyAvailable(ns.args[0]);
			var gssl = ns.getServerSecurityLevel(ns.args[0]);
			var gsmsl = ns.getServerMinSecurityLevel(ns.args[0]);
			var sslr = gssl - gsmsl;//security level to be removed
			var sslt = sslr / 0.05;//weaken threads to remove sslr
			var gsmr = ns.getServerMaxRam(ns.args[1]);
			var gsur = ns.getServerUsedRam(ns.args[1]);
			var gscr = gsmr - gsur;
			var gmulti = ns.getServerMaxMoney(ns.args[0]) / ns.getServerMoneyAvailable(ns.args[0]);
			var ga = ns.growthAnalyze(ns.args[0], gmulti, 1);//grow threads
			var gsi = (ga * 0.004) / 0.05 + 2;//additional weaken threads from grow threads
			var gagsi = (ga + gsi) * 1.75;//grow (and consequential weaken) RAM usage
			var gwratio = gscr / gagsi;
			if (gssl > gsmsl) {
				if (gsmm > gsma) {
					if (Math.ceil(sslt * 1.75 + gagsi) < gscr) {
						ns.print("protocol 1");
						ns.exec("growonce.js", ns.args[1], Math.ceil(ga), ns.args[0]);
						ns.exec("weakenonce.js", ns.args[1], Math.ceil(gsi + sslt), ns.args[0]);
					} else if (Math.ceil(sslt * 1.75) < gscr) {
						ns.print("protocol 2");
						ns.exec("growonce.js", ns.args[1], Math.floor(gscr / 1.75 - sslt - (0.004 * (gscr / 1.75 - sslt) / 0.05)) - 1, ns.args[0]);
						ns.exec("weakenonce.js", ns.args[1], Math.floor(sslt + (0.004 * (gscr / 1.75 - sslt) / 0.05)) + 1, ns.args[0]);
					} else {
						ns.print("protocol 3");
						ns.exec("weakenonce.js", ns.args[1], Math.floor(gscr / 1.75), ns.args[0]);
					}
				} else {
					ns.print("protocol 4");
					ns.exec("weakenonce.js", ns.args[1], Math.ceil(sslt), ns.args[0]);
				}
			} else if (gsmm > gsma) {
				if (Math.ceil(gagsi) < gscr) {
					ns.print("protocol 5");
					ns.exec("growonce.js", ns.args[1], Math.ceil(ga), ns.args[0]);
					ns.exec("weakenonce.js", ns.args[1], Math.ceil(gsi), ns.args[0]);
				} else {
					ns.print("protocol 6");
					ns.exec("growonce.js", ns.args[1], Math.floor(ga * gwratio) - 1, ns.args[0]);
					ns.exec("weakenonce.js", ns.args[1], Math.floor(gsi * gwratio) + 1, ns.args[0]);
				}
			}
			if (gssl > gsmsl || gsmm > gsma) {
				await ns.sleep(ns.getWeakenTime(ns.args[0]) + 1000);
			}
		} while (gssl > gsmsl || gsmm > gsma)

		// This segment calculates the optimal percentage of money to hack.
		await ns.sleep(50);
		for (var i = 1; i < 100; i++) {
			var percent = i / 100;
			var h = ns.hackAnalyzeThreads(
				ns.args[0],
				ns.getServerMaxMoney(ns.args[0]) * percent
			);
			var g = ns.growthAnalyze(ns.args[0], 1 / (1 - percent), 1);
			var w = (0.004 * Math.ceil(g) + 0.002 * Math.floor(h)) / 0.05;
			var wtime = ns.getWeakenTime(ns.args[0]);
			var wthreads = Math.ceil(w);
			var gthreads = Math.ceil(g);
			var hthreads = Math.floor(h);
			var ph = 1.7 * hthreads;
			var pg = 1.75 * gthreads;
			var pw = 1.75 * wthreads;
			var packet = ph + pg + pw;
			if (ns.args[1] == "home") {
				var instances = Math.floor(
					(ns.getServerMaxRam(ns.args[1]) - 8.15) / (packet + 5.2)
				);
			} else {
				var instances = Math.floor(ns.getServerMaxRam(ns.args[1]) / packet);
			}
			var itime = wtime / instances;
			var itime3 = itime / 15;
			var unitime = 10.5;
			await ns.sleep(5);
			if (itime3 > unitime) {
				break;
			}
		}

		// This segment calculates the amount of scripts to be run at once.
		if (itime3 > unitime && instances < 3333) {
			var inst2 = instances;
		} else if (wtime / 5 / unitime > 9999) {
			var inst2 = 3333;
		} else if (itime3 < unitime) {
			var inst2 = Math.floor(wtime / 5 / (unitime * 5));
		}

		// This segment calculates the time between each script.
		if (itime3 > unitime) {
			var i3time = itime3;
		} else {
			var i3time = unitime;
		}

		// This segment executes all of the calulated hack, grow, and weaken scripts in a for() loop
		var htime = ns.getHackTime(ns.args[0]);
		var gtime = ns.getGrowTime(ns.args[0]);
		var wtime = ns.getWeakenTime(ns.args[0]);
		var sleep1 = wtime - htime;
		var sleep2 = wtime - gtime;
		for (var i = 0; i < inst2; i++) {
			ns.exec("zhack.js", ns.args[1], hthreads, ns.args[0], sleep1, i);
			await ns.sleep(i3time);
			ns.exec("zgrow.js", ns.args[1], gthreads, ns.args[0], sleep2, i);
			await ns.sleep(i3time);
			ns.exec("zweaken.js", ns.args[1], wthreads, ns.args[0], i);
			await ns.sleep(i3time);
		}
		await ns.sleep(wtime + 600 - (percent * 600));
	}
}