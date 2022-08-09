/** @param {NS} ns **/
export async function main(ns) {
    // ALTER ONE OR BOTH OF THESE CONSTANTS IF NEEDED:
    // These are constants that act as limiters and that may be configured for increased or decreased performance needs:
    const unitime = 10; // the minimum time allowed between script executions in milliseconds (raise if scripts misalign).
    const maxscripts = 9000; // the maximum # of scripts that Zprogram is allowed to produce (lower this if game crashes).

    const maxinstances = Math.floor(maxscripts / 3);

    ns.clearLog();
    ns.disableLog("ALL");
    ns.tail();
    ZprogramIntro();

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
                ns.tprint(
                    "target: ", target,
                    "  bestserver: ", bestserver,
                    "  percent: ", percent,
                    "  besthackchance: ", besthackchance,
                    "  ns.getServerMaxMoney(serverarray[i]): ", ns.getServerMaxMoney(serverarray[i]),
                    "  bestinstances: ", bestinstances,
                    "  bestweakentime * (21 / 16): ", bestweakentime * (21 / 16),
                );
            }
        }
        ns.print("Most profitable target identified: ", target);
    } else {
        var target = ns.args[0];
    }

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

        var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
            wtime = ns.getWeakenTime(target),
            htime = ns.getHackTime(target),
            gtime = ns.getGrowTime(target),
            sleep1 = wtime - htime,
            sleep2 = wtime - gtime;

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

    function CustomHackAnalyze(percent) {
        return ns.getServerMaxMoney(serverarray[i]) * percent / (
            ns.getServerMaxMoney(serverarray[i]) * ns.hackAnalyze(serverarray[i]) * (
                (100 - ns.getServerMinSecurityLevel(serverarray[i])) /
                (100 - ns.getServerSecurityLevel(serverarray[i]))
            )
        );
    }

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
