# Bitburner-Zprogram-Script
Zprogram by u/DryFacade


Instructions for how to use this script: 
you can name the script whatever, but in this case I'll use zprogram.js. Running the script only takes at most 2 arguments, and it's very simple.

typing in "run zprogram.js" into the terminal and nothing else will run the script based on the best target to hack, and the best server to host the script.

typing in "run zprogram.js best [server_name_here]" into the terminal will run the script based on the best target to hack, and the server defined.

typing in "run zprogram.js [target_name_here] best" into the terminal will run the script based on the target defined, and the best server to host the script.

typing in "run zprogram.js [target_name_here] [server_name_here]" into the terminal will run the script based on the target AND server defined.




The methodology for how this script runs is as follows (in chronological order), and each block is also numbered in the copy of the script below:


1.) Determines a few constants and displays info in the log.

2.) Determines the best server to host the script, unless a server is specifically defined as the second argument when starting zprogram.

3.) Determines the most profitable server to hack possible at the time of initialization, unless defined otherwise as the first argument when starting zprogram.

4.) Verifies that the most profitable server has root access, and will gain it if it does not.

4.5) If the necessary port openers aren't yet downloaded/created, then the next best server which CAN be hacked into will be selected instead.
    
5.) Important files are created, such as the ones that will run hack(), grow(), and weaken(), and will then be sent to the host server via the "scp" command.

6.) Server security must be at minimum as well as server money at maximum in order to continue from this point. This part of the script will efficiently run the necessary threaded grow() and weaken() scripts (in a loop if needed) until both of these conditions are met. There are 6 different protocols that are designed to fit the specific condition that a server can be in. For example, protocol 1 will be used if the host server has sufficient RAM to prep the target in one fell swoop. Protocol 3 will be used if there is only enough RAM to run weaken threads but not grow threads. security will always be higher priority than growth.

7.) a few variables are defined (or re-defined) in preparation for the following blocks.

8.) This block primarily determines the most profitable percentage to hack the target's money for. For example, if it's found that 15% of the server's money is the most profitable percentage to hack, and if one thread of hack() steals 0.5% of the target's money, 30 hack() threads will be run per packet. Other important variables will also be determined by this block, such as the number of packets to be run per cycle, and how much time to place between each script execution.

9.) This block is to set limitations. Sometimes when using massive host servers, the number of packets per cycle exceeds the constant "maxinstances", and other times the time between scripts is lower than the constant "unitime", or sometimes both. This part of the script will set limits to the numbers found by the previous block if needed. Without this block, the script could crash or be counterintuitively inefficient in these instances. The last half of the block is intended to help improve performance if the host server has very low RAM.

10.) This block now executes a hack() grow() weaken() chain using the necessary variables that have now been determined. A successive instance of hack() grow() and weaken() accounts for one packet. Many packets will be run in succession in every cycle, and each script will always have tailored-to thread counts as determined by steps 8 and 9 for maximized efficiency. Note that sometimes in my code, instances and packets are synonymous in meaning. The length of time that a hack() grow() weaken() chain will run for is equal to 3/16ths of the time it takes to weaken the target server. There is a very good reason for this number, but it's complicated and time consuming to explain. After the final link of the chain has been executed, the script now sleeps for a period equal to weaken time * 1.015.

11.) Determines script's income, it's remarkably simple.

12.) Functions: Some of these functions serve the purpose of creating and providing commands that are not provided by the game already, but which were necessary for the operation of my script. I dove deep into the source files to derive and customize a lot of these, and i think some of them are pretty neat.

    1.) Returns the amount of ports able to be opened based on which port programs you have.
    
    2.) A customized version of hackAnalyze() which returns the same value, however with the difference that it only returns a value based on minimum security level,       and ignores the current security level. This function is used in the process of determining the most profitable server.
    
    3.) This function is a 2-in-1. It doubles as a customized version of growthAnalyze() with similar function as the previously discussed function, and can also be       used to return the percent of money hacked per thread while having the same advantage of ignoring current security level. This function is also used in the process     of determining the most profitable server.
    
    4.) This function is also a 2-in-1. It returns the most efficient percentage of money to hack per packet without using current security level, and returns the         ideal number of instances to run. This function is used in the process of determining the most profitable server.
    
    5.) This function is also a 2-in-1. It returns weaken time and also returns hack chance while ignoring current security level. This function is also used in the       process of determining the most profitable server.
    
    6.)List of all targetable servers in bitburner.
    
    7.)Introductory message that prints into the log when called.
    
    
To paint a clearer picture of what this script essentially looks like in action, I'll describe a real-world example that i just ran. upon typing in the command, it determines all of the information that I mentioned and prints useful info into the log. At my level (which is 664 at the moment), it determined the-hub as the most profitable target and that "home" was the best host server, which is obvious because it has 2 PB in RAM. It then prepped the target since it seems that it's security and money wasn't where it should be, so i had to wait for that to finish. After that, the script continued and began initializing the hack() grow() weaken() script chain and printed into the log that the process will take 45.480 seconds. It then went into the waiting stage and again prints into the log how long it'll take for the start of the chain to begin maturing which was 197.081 seconds, and the end of the chain to finish maturing which was 242.561 seconds. After this, the script renews the cycle and begins again, this time skipping the server prepping because it was already prepped. At the start of the next cycle, it reports the script's income which was $8.021b / sec.


I had designed my script to keep it prepped by the end of the script chain every time the cycle renews. Although, the script is also able to prep the target in the     case that somehow the scripts misalign, which can happen with massive host servers albeit uncommonly. If too many scripts run, the came could also crash, so           there's that. Make sure to regulate the two constants at the top of the scripts to match with performance needs, or to boost the script's performance.
    
    


/** @param {NS} ns **/
export async function main(ns) {

1.)
    // ALTER ONE OR BOTH OF THESE CONSTANTS IF NEEDED:
    // These are constants that act as limiters and that may be configured for increased or decreased performance needs:
    const unitime = 10; // the minimum time allowed between script executions in milliseconds (raise if scripts misalign).
    const maxscripts = 9000; // the maximum # of scripts that Zprogram is allowed to produce (lower this if game crashes).

    const maxinstances = Math.floor(maxscripts / 3);

    ns.clearLog();
    ns.disableLog("ALL");
    ns.tail();
    ZprogramIntro();

2.)
    if (ns.args[1] == "best" || (ns.args[0] == null && ns.args[1] == null)) {
        var purchasedservers = ns.getPurchasedServers(),
            purchasedarray = purchasedservers.length,
            besthost = ns.getServerMaxRam("home") - ns.getServerUsedRam("home"),
            host = "home";
        for (var i = 0; i < purchasedarray; i++) {
            var hostcandidate = ns.getServerMaxRam(purchasedservers[i]) - ns.getServerUsedRam(purchasedservers[i]);
            if (hostcandidate > besthost) {
                var besthost = hostcandidate,
                    host = purchasedservers[i];
            }
        }
        ns.print("Best host server identified: ", host);
    } else {
        var host = ns.args[1];
    }

3.)
    if (ns.args[0] == "best" || (ns.args[0] == null && ns.args[1] == null)) {
        var serverarray = TargetsList(),
            arraylength = serverarray.length,
            bestserver = 0;
        for (var i = 0; i < arraylength; i++) {
            await ns.sleep(0);
            var bestweakentime = CalcWtimeHchance(0),
                besthackchance = CalcWtimeHchance(1),
                percent = CalcPercentInstances(0),
                bestinstances = CalcPercentInstances(1);
            if (
                bestserver <= (percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) * bestinstances) /
                (bestweakentime * (21 / 16)) &&
                ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverarray[i])
            ) {
                var bestserver = (percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) * bestinstances) /
                    (bestweakentime * (21 / 16)),
                    target = serverarray[i];
            }
        }
        ns.print("Most profitable target identified: ", target);
    } else {
        var target = ns.args[0];
    }

4.)
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
            ns.print("Error: unable to gain root access.",
                " Make sure you have the necessary programs to open ports for ",
                target, ".");
            var serverarray = TargetsList(),
                arraylength = serverarray.length,
                bestserver = 0;
            for (var i = 0; i < arraylength; i++) {
                await ns.sleep(0);
                var bestweakentime = CalcWtimeHchance(0),
                    besthackchance = CalcWtimeHchance(1),
                    percent = CalcPercentInstances(0),
                    bestinstances = CalcPercentInstances(1);
                if (
                    bestserver <= (percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) * bestinstances) /
                    (bestweakentime * (21 / 16)) &&
                    ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverarray[i]) &&
                    ns.getServerNumPortsRequired(serverarray[i]) <= TotalPortsExe(serverarray[i])
                ) {
                    var bestserver = percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) *
                        bestinstances / (bestweakentime * (21 / 16)),
                        target = serverarray[i];
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
        }
        await ns.sleep(100);
    }

5.)
    var growonce = `/** @param {NS} ns */
export async function main(ns) {
    await ns.grow(ns.args[0]);
}`;
    await ns.write("growonce.js", growonce, "w");
    var weakenonce = `/** @param {NS} ns */
export async function main(ns) {
    await ns.weaken(ns.args[0]);
}`;
    await ns.write("weakenonce.js", weakenonce, "w");
    var zhack = `/** @param {NS} ns */
export async function main(ns) {
    await ns.sleep(ns.args[1]);
    await ns.hack(ns.args[0]);
}`;
    await ns.write("zhack.js", zhack, "w");
    var zgrow = `/** @param {NS} ns */
export async function main(ns) {
    await ns.sleep(ns.args[1]);
    await ns.grow(ns.args[0]);
}`;
    await ns.write("zgrow.js", zgrow, "w");
    var zweaken = `/** @param {NS} ns */
export async function main(ns) {
    await ns.sleep(0);
    await ns.weaken(ns.args[0]);
}`;
    await ns.write("zweaken.js", zweaken, "w");
    var zfiles = [
        "growonce.js",
        "weakenonce.js",
        "zhack.js",
        "zgrow.js",
        "zweaken.js",
    ];
    await ns.scp(zfiles, "home", host);
    ns.print("Copy/pasted necessary files to host server.");

6.)
    while (true) {
        ns.print("Verifying that target server is prepped...");
        do {
            var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
                maxMoney = ns.getServerMaxMoney(target),
                currentMoney = ns.getServerMoneyAvailable(target),
                seclvl = ns.getServerSecurityLevel(target),
                minSeclvl = ns.getServerMinSecurityLevel(target),
                seclvlRemoved = seclvl - minSeclvl,
                weakThreads = seclvlRemoved / 0.05,
                growthMultiplier = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target),
                growThreads = ns.growthAnalyze(target, growthMultiplier, 1),
                extraWeakThreads = (growThreads * 0.004) / 0.05 + 2,
                extraWeakGrowRam = (growThreads + extraWeakThreads) * 1.75,
                extraWeakGrowRatio = freeRam / extraWeakGrowRam;
            if (seclvl > minSeclvl) {
                ns.print("Target server requires prepping. Now initializing a grow/weaken protocol.");
                if (maxMoney > currentMoney) {
                    if (Math.ceil(weakThreads * 1.75) + Math.ceil(extraWeakGrowRam) < freeRam) {
                        var protocol = "protocol 1";
                        ns.exec("growonce.js", host, Math.ceil(growThreads), target);
                        ns.exec("weakenonce.js", host, Math.ceil(extraWeakThreads + weakThreads), target);
                    } else if (Math.ceil(weakThreads * 1.75 + 1.75) < freeRam) {
                        var protocol = "protocol 2";
                        ns.exec("growonce.js", host, Math.floor(
                            freeRam / 1.75 - weakThreads - (0.004 * (freeRam / 1.75 - weakThreads) / 0.05)
                        ) - 1, target);
                        ns.exec("weakenonce.js", host, Math.floor(
                            weakThreads + (0.004 * (freeRam / 1.75 - weakThreads) / 0.05)
                        ) + 1, target);
                    } else {
                        var protocol = "protocol 3";
                        ns.exec("weakenonce.js", host, Math.floor(freeRam / 1.75), target);
                    }
                } else {
                    var protocol = "protocol 4";
                    ns.exec("weakenonce.js", host, Math.ceil(weakThreads), target);
                }
            } else if (maxMoney > currentMoney) {
                ns.print("Target server requires prepping. Now initializing a grow/weaken protocol.");
                if (Math.ceil(extraWeakGrowRam) < freeRam) {
                    var protocol = "protocol 5";
                    ns.exec("growonce.js", host, Math.ceil(growThreads), target);
                    ns.exec("weakenonce.js", host, Math.ceil(extraWeakThreads), target);
                } else {
                    var protocol = "protocol 6";
                    ns.exec("growonce.js", host, Math.floor(growThreads * extraWeakGrowRatio) - 1, target);
                    ns.exec("weakenonce.js", host, Math.floor(extraWeakThreads * extraWeakGrowRatio) + 1, target);
                }
            }
            if (seclvl > minSeclvl || maxMoney > currentMoney) {
                ns.print(protocol, " will take ", Math.round(ns.getWeakenTime(target) + 1000) / 1000,
                    " seconds. Multiple instances may be looped...");
                await ns.sleep(ns.getWeakenTime(target) + 1000);
            } else {
                ns.print("Target server is prepped.");
            }
        } while (seclvl > minSeclvl || maxMoney > currentMoney)

7.)
        var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
            wtime = ns.getWeakenTime(target),
            htime = ns.getHackTime(target),
            gtime = ns.getGrowTime(target),
            sleep1 = wtime - htime,
            sleep2 = wtime - gtime;

8.)
        for (var i = 1; i < 100; i++) {
            var percent = i / 100,
                rawHThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * percent),
                rawGThreads = ns.growthAnalyze(target, 1 / (1 - percent), 1),
                rawWThreads = (0.004 * Math.ceil(rawGThreads * 1.05) + 0.002 * Math.floor(rawHThreads)) / 0.05,
                wThreads = Math.ceil(rawWThreads + 1),
                gThreads = Math.ceil(rawGThreads * 1.05),
                hThreads = Math.floor(rawHThreads),
                hPacket = 1.7 * hThreads,
                gPacket = 1.75 * gThreads,
                wPacket = 1.75 * wThreads,
                packet = hPacket + gPacket + wPacket,
                rawinstances = freeRam / packet,
                instances = Math.floor(rawinstances),
                instanceTime = wtime / instances,
                instanceTime16 = instanceTime / 16;
            if (instanceTime16 > unitime && instances < maxinstances && percent < 0.99) {
                break;
            }
        }
        if (instances <= 0) {
            var packet = 0
            for (var i = 1; i < 1 / 0; i++) {
                if (packet > freeRam) {
                    var percent = ns.hackAnalyze(target) * (i - 2),
                        breaktime = true;
                } else {
                    var percent = ns.hackAnalyze(target) * i;
                }
                var rawHThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * percent),
                    rawGThreads = ns.growthAnalyze(target, 1 / (1 - percent), 1),
                    rawWThreads = (0.004 * Math.ceil(rawGThreads) + 0.002 * Math.floor(rawHThreads)) / 0.05,
                    wThreads = Math.ceil(rawWThreads),
                    gThreads = Math.ceil(rawGThreads),
                    hThreads = Math.floor(rawHThreads),
                    hPacket = 1.7 * hThreads,
                    gPacket = 1.75 * gThreads,
                    wPacket = 1.75 * wThreads,
                    packet = hPacket + gPacket + wPacket,
                    rawinstances = freeRam / packet,
                    instances = Math.floor(rawinstances),
                    instanceTime = wtime / instances,
                    instanceTime16 = instanceTime / 16;
                if (breaktime == true) {
                    break;
                } else if (packet >= freeRam && i == 1) {
                    ns.print("There is not enough server RAM to run this script with target set as ",
                        target, ". Now terminating Zprogram...")
                    ns.exit()
                }
            }
        }
        ns.print("Hacking ", target, " at ", Math.round(percent * 10000000) / 100000, "% money per packet.");

9.)
        if (instanceTime16 > unitime && instances < maxinstances) {
            var instances2 = instances,
                timeBetweenInstances = instanceTime16;
        } else if (instanceTime16 > unitime && instances >= maxinstances) {
            var instances2 = maxinstances,
                timeBetweenInstances = instanceTime16;
        } else if (instanceTime16 <= unitime && instances < maxinstances) {
            var instances2 = Math.floor(rawinstances * instanceTime16 / unitime),
                timeBetweenInstances = unitime;
        } else if (instances * instanceTime16 / unitime < maxinstances) {
            var instances2 = Math.floor(rawinstances * instanceTime16 / unitime),
                timeBetweenInstances = unitime;
        } else {
            var instances2 = maxinstances,
                timeBetweenInstances = unitime;
        }
        if (percent <= 0.01) {
            ns.print("Total scripts to be run: ", instances2 * 3, " (", instances2, " packets).");
        } else {
            ns.print("Total scripts to be run: ", instances2 * 3 - 1, " (", instances2 - 1, " packets).");
        }
        ns.print("Time between each script: ", Math.round(timeBetweenInstances * 1000) / 1000, "ms.");

10.)
        ns.print("Now initializing hack/grow/weaken chain. This process will take ",
            Math.round(timeBetweenInstances * instances2 * 3) / 1000, " seconds.");
        if (percent <= 0.01) {
            for (var i = 0; i < instances2; i++) {
                ns.exec("zhack.js", host, hThreads, target, sleep1, i);
                await ns.sleep(timeBetweenInstances);
                ns.exec("zgrow.js", host, gThreads, target, sleep2, i);
                await ns.sleep(timeBetweenInstances);
                ns.exec("zweaken.js", host, wThreads, target, i);
                await ns.sleep(timeBetweenInstances);
            }
        } else {
            for (var i = 0; i < instances2 - 1; i++) {
                ns.exec("zhack.js", host, hThreads, target, sleep1, i);
                await ns.sleep(timeBetweenInstances);
                ns.exec("zgrow.js", host, gThreads, target, sleep2, i);
                await ns.sleep(timeBetweenInstances);
                ns.exec("zweaken.js", host, wThreads, target, i);
                await ns.sleep(timeBetweenInstances);
            }
            ns.exec("zgrow.js", host, gThreads, target, sleep2, i);
            await ns.sleep(timeBetweenInstances);
            ns.exec("zweaken.js", host, wThreads + hThreads, target, i);
            await ns.sleep(timeBetweenInstances * 2);
        }
        ns.print("Done. Script chain will start in ", Math.round(wtime - timeBetweenInstances * instances2 * 3) / 1000,
            " seconds and will finish in ", Math.round(wtime) / 1000, " seconds.");
        await ns.sleep(wtime * 1.015);

11.)
        ns.print("Cycle complete. Renewing script chain...");
        ns.print(" ");
        if (ns.args[0] == null && ns.args[1] == null) {
            var moneysec = ns.getScriptIncome(ns.getScriptName(), ns.getHostname());
        } else {
            var moneysec = ns.getScriptIncome(ns.getScriptName(), ns.getHostname(), ns.args[0], ns.args[1]);
        }
        if (moneysec < 1000) {
            ns.print("Average income: $", Math.round(moneysec * 1000) / 1000, " / sec.");
        } else if (moneysec < 1000000) {
            ns.print("Average income: $", Math.round(moneysec) / 1000, "k / sec.");
        } else if (moneysec < 1000000000) {
            ns.print("Average income: $", Math.round(moneysec / 1000) / 1000, "m / sec.");
        } else if (moneysec < 1000000000000) {
            ns.print("Average income: $", Math.round(moneysec / 1000000) / 1000, "b / sec.");
        } else {
            ns.print("Average income: $", Math.round(moneysec / 1000000000) / 1000, "t / sec.");
        }
    }


12.)

    1.)
    function TotalPortsExe(target) {
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

    2.)
    function CustomHackAnalyze(percent) {
        return ns.getServerMaxMoney(serverarray[i]) * percent / (
            ns.getServerMaxMoney(serverarray[i]) * ns.hackAnalyze(serverarray[i]) * (
                (100 - ns.getServerMinSecurityLevel(serverarray[i])) /
                (100 - ns.getServerSecurityLevel(serverarray[i]))
            )
        );
    }

    3.)
    function CustomGAnalyzeHThread(variable, number) {
        if (number == 0) {
            var growthp = 1 / (1 - variable);
        } else if (number == 1) {
            var growthp = 1 / (1 - percent);
        }
        var serverGrowthPercentage = ns.getServerGrowth(serverarray[i]) / 100,
            ajdGrowthRatebit = 1 + (1.03 - 1) / ns.getServerSecurityLevel(serverarray[i]);
        if (ajdGrowthRatebit > 1.0035) {
            ajdGrowthRatebit = 1.0035;
        }
        var ajdGrowthRate = 1 + (1.03 - 1) / ns.getServerMinSecurityLevel(serverarray[i]);
        if (ajdGrowthRate > 1.0035) {
            ajdGrowthRate = 1.0035;
        }
        var bitnode = (
            Math.log(growthp) / (
                Math.log(ajdGrowthRatebit) *
                ns.getHackingMultipliers(serverarray[i]).growth *
                (serverGrowthPercentage))
        ) / ns.growthAnalyze(serverarray[i], growthp);
        if (number == 0) {
            return Math.log(growthp) / (
                Math.log(ajdGrowthRate) *
                ns.getHackingMultipliers(serverarray[i]).growth *
                (serverGrowthPercentage) *
                bitnode
            );
        } else if (number == 1) {
            return 1 - 1 / (
                10 ** (
                    variable *
                    Math.log10(1.0035) *
                    ns.getHackingMultipliers(serverarray[i]).growth *
                    serverGrowthPercentage *
                    bitnode
                )
            );
        }
    }

    4.)
    function CalcPercentInstances(whatinstances) {
        var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
            wtime = bestweakentime;
        for (var i = 1; i < 100; i++) {
            var percentp = i / 100,
                rawHThreads = CustomHackAnalyze(percentp),
                rawGThreads = CustomGAnalyzeHThread(percentp, 0),
                rawWThreads = (0.004 * Math.ceil(rawGThreads * 1.05) + 0.002 * Math.floor(rawHThreads)) / 0.05,
                wThreads = Math.ceil(rawWThreads + 1),
                gThreads = Math.ceil(rawGThreads * 1.05),
                hThreads = Math.floor(rawHThreads),
                hPacket = 1.7 * hThreads,
                gPacket = 1.75 * gThreads,
                wPacket = 1.75 * wThreads,
                packet = hPacket + gPacket + wPacket,
                rawinstances = freeRam / packet,
                instances = Math.floor(rawinstances),
                instanceTime = wtime / instances,
                instanceTime16 = instanceTime / 16;
            if (instanceTime16 > unitime && instances < maxinstances && percentp < 0.99) {
                break;
            }
        }
        if (instances <= 0) {
            var packet = 0
            for (var i = 1; i < 1 / 0; i++) {
                if (packet > freeRam) {
                    var percentp = CustomGAnalyzeHThread(i - 2, 1),
                        breaktime = true
                } else {
                    var percentp = CustomGAnalyzeHThread(i, 1);
                }
                var rawHThreads = CustomHackAnalyze(percentp),
                    rawGThreads = CustomGAnalyzeHThread(percentp, 0),
                    rawWThreads = (0.004 * Math.ceil(rawGThreads) + 0.002 * Math.floor(rawHThreads)) / 0.05,
                    wThreads = Math.ceil(rawWThreads),
                    gThreads = Math.ceil(rawGThreads),
                    hThreads = Math.floor(rawHThreads),
                    hPacket = 1.7 * hThreads,
                    gPacket = 1.75 * gThreads,
                    wPacket = 1.75 * wThreads,
                    packet = hPacket + gPacket + wPacket,
                    rawinstances = freeRam / packet,
                    instances = Math.floor(rawinstances),
                    instanceTime = wtime / instances,
                    instanceTime16 = instanceTime / 16;
                if (breaktime == true) {
                    break;
                } else if (packet >= freeRam && i == 1) {
                    break;
                }
            }
        }
        if (instanceTime16 > unitime && instances < maxinstances) {
            var instances2 = instances;
        } else if (instanceTime16 > unitime && instances >= maxinstances) {
            var instances2 = maxinstances;
        } else if (instanceTime16 <= unitime && instances < maxinstances) {
            var instances2 = Math.floor(rawinstances * instanceTime16 / unitime);
        } else if (instances * instanceTime16 / unitime < maxinstances) {
            var instances2 = Math.floor(rawinstances * instanceTime16 / unitime);
        } else {
            var instances2 = maxinstances;
        }
        if (whatinstances == 0) {
            return percentp;
        } else if (whatinstances == 1) {
            if (percent <= 0.01) {
                return instances2;
            } else {
                return instances2 - 1;
            }
        }
    }

    5.)
    function CalcWtimeHchance(number) {
        var reqhacklvl = ns.getServerRequiredHackingLevel(serverarray[i]),
            minseclvl = ns.getServerMinSecurityLevel(serverarray[i]),
            getseclvl = ns.getServerSecurityLevel(serverarray[i]),
            hacktime = ns.getHackTime(serverarray[i]),
            hacklvl = ns.getHackingLevel(serverarray[i]),
            hackchance = ns.hackAnalyzeChance(serverarray[i]);
        if (number == 0) {
            return (
                (reqhacklvl * minseclvl * 2.5 + 500) /
                (reqhacklvl * getseclvl * 2.5 + 500)
            ) * hacktime * 4;
        } else if (number == 1) {
            var percenta = (100 - minseclvl) / 100,
                percentb = (100 - getseclvl) / 100,
                percentc = 1.75 * hacklvl,
                percentd = percenta * (percentc - reqhacklvl) / percentc,
                percente = percentb * (percentc - reqhacklvl) / percentc,
                calchackchance = hackchance * percentd / percente;
            if (calchackchance > 1) {
                var calchackchance = 1;
            } else if (calchackchance < 0) {
                var calchackchance = 0;
            }
            return calchackchance;
        }
    }

    6.)
    function TargetsList() {
        return [
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
    }

    7.)
    function ZprogramIntro() {
        return ns.print("Now running Zprogram by u/DryFacade"),
            ns.print(" "),
            ns.print(
                'Please note: if the calculated time between each script is extremely brief, ',
                'looking at the UI of the "Active scripts" tab to the left as well as running more than ',
                'one instance of Zprogram may occasionally cause scripts to misalign temporarily.'
            ),
            ns.print(" ");
    }
}
