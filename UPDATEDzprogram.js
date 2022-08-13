/** @param {NS} ns */
export async function main(ns) {
    // There is no README for this version.

    // ALTER ONE OR BOTH OF THESE CONSTANTS IF NEEDED:
    // These are constants that act as limiters and that may be configured for increased or decreased performance needs:
    const unitime = 10; // the minimum time allowed between script executions in milliseconds (raise if scripts misalign).
    const maxscripts = 9000; // the maximum # of scripts that Zprogram is allowed to produce (lower this if game crashes).

    const maxinstances = Math.floor(maxscripts / 3);

    ns.clearLog();
    ns.disableLog("ALL");
    ns.tail();
    ns.print(
        "Now running Zprogram by u/DryFacade",
        '\n\nPlease note: if the calculated time between each script is extremely brief, ',
        'looking at the UI of the "Active scripts" tab to the left as well as running more than ',
        'one instance of Zprogram may occasionally cause scripts to misalign temporarily.\n\n'
    );

    if (ns.args[1] == "best" || (ns.args[0] == null && ns.args[1] == null)) {
        var host = BestHost();
        ns.print("Best host server identified: ", host);
    } else {
        var host = ns.args[1];
    }

    if (ns.args[0] == "best" || (ns.args[0] == null && ns.args[1] == null)) {
        var target = BestTarget(0);// <<<Fun fact: ~45% of the whole script is dedicated to the function "BestTarget()".
        ns.print("Most profitable target identified: ", target);
    } else {
        var target = ns.args[0];
    }

    if (ns.hasRootAccess(target) == true) {
        ns.print("Root access to ", target, " has been verified.");
    } else {
        if (ns.getServerNumPortsRequired(target) - TotalPortsExes() <= 0) {
            NukeTarget();
            ns.print("Gained root access to ", target, ".");
        } else {
            ns.print(
                "WARNING: unable to gain root access. Make sure you ",
                "have the necessary programs to open ports for ", target, "."
            );
            var target = BestTarget(1);
            ns.print("Next best server available: ", target);
            if (ns.hasRootAccess(target) == true) {
                ns.print("Root access to ", target, " has been verified.");
            } else {
                NukeTarget();
                ns.print("Gained root access to ", target, ".");
            }
        }
        await ns.sleep(100);
    }

    let growonce = `export async function main(ns) { await ns.grow(ns.args[0]); }`,
        weakenonce = `export async function main(ns) { await ns.weaken(ns.args[0]); }`,
        zhack = `export async function main(ns) { await ns.sleep(ns.args[1]); await ns.hack(ns.args[0]); }`,
        zgrow = `export async function main(ns) { await ns.sleep(ns.args[1]); await ns.grow(ns.args[0]); }`,
        zweaken = `export async function main(ns) { await ns.sleep(0); await ns.weaken(ns.args[0]); }`,
        zfiles = ["growonce.js", "weakenonce.js", "zhack.js", "zgrow.js", "zweaken.js"];
    await ns.write("growonce.js", growonce, "w");
    await ns.write("weakenonce.js", weakenonce, "w");
    await ns.write("zhack.js", zhack, "w");
    await ns.write("zgrow.js", zgrow, "w");
    await ns.write("zweaken.js", zweaken, "w");
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
                ns.print("WARNING: target server requires prepping. Now initializing a grow/weaken protocol.");
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
                ns.print("WARNING: target server requires prepping. Now initializing a grow/weaken protocol.");
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

        let wtime = ns.getWeakenTime(target),
            htime = ns.getHackTime(target),
            gtime = ns.getGrowTime(target),
            sleep1 = wtime - htime,
            sleep2 = wtime - gtime;

        for (let i = 1; i < 100; i++) {
            var percent = i / 100,
                hackThdsPerPack = Math.floor(CustomHackAnalyzeThreads(target, percent)),
                growThdsPerPack = Math.ceil(CustomGrowthAnalyzeThreads(target, percent)),
                weakThdsPerPack = Math.ceil((0.004 * growThdsPerPack + 0.002 * hackThdsPerPack) / 0.05),
                packet = (hackThdsPerPack * 1.7 + (growThdsPerPack + weakThdsPerPack) * 1.75),
                rawinstances = freeRam / packet,
                instances = Math.floor(rawinstances),
                instanceTime = wtime / instances,
                instanceTime16 = instanceTime / 16;
            if (instanceTime16 > unitime && instances < maxinstances && percent < 0.99) {
                break;
            }
        }

        if (instances < 1) {
            ns.print(
                "\nERROR: Host server does not have enough RAM to run Zprogram!",
                " Ensure that the host server has at minimum ", packet * 2,
                " GB of available RAM.\nKilling script..."
            );
            ns.exit();
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
        ns.print(
            "Total scripts to be run: ", instances2 * 3, " (", instances2, " packets).\n",
            "Time between each script: ", Math.round(timeBetweenInstances * 1000) / 1000, "ms.",
            "\nNow initializing hack/grow/weaken chain. This process will take ",
            Math.round(timeBetweenInstances * instances2 * 3) / 1000, " seconds."
        );

        for (let i = 0; i < instances2; i++) {
            ns.exec("zhack.js", host, hackThdsPerPack, target, sleep1, i);
            await ns.sleep(timeBetweenInstances);
            ns.exec("zgrow.js", host, growThdsPerPack, target, sleep2, i);
            await ns.sleep(timeBetweenInstances);
            ns.exec("zweaken.js", host, weakThdsPerPack, target, i);
            await ns.sleep(timeBetweenInstances);
        }

        ns.print(
            "Done. Script chain will start in ",
            Math.round(wtime - timeBetweenInstances * instances2 * 3) / 1000,
            " seconds and will finish in ",
            Math.round(wtime) / 1000, " seconds."
        );
        await ns.sleep(wtime + unitime);

        ns.print("Cycle complete. Renewing script chain...\n\n");
        if (ns.args[0] == null && ns.args[1] == null) {
            var moneysec = ns.getScriptIncome(ns.getScriptName(), ns.getHostname());
        } else {
            var moneysec = ns.getScriptIncome(ns.getScriptName(), ns.getHostname(), ns.args[0], ns.args[1]);
        }
        if (moneysec < 1e3) {
            ns.print("Average income: $", Math.round(moneysec * 1e3) / 1e3, " / sec.");
        } else if (moneysec < 1e6) {
            ns.print("Average income: $", Math.round(moneysec) / 1e3, "k / sec.");
        } else if (moneysec < 1e9) {
            ns.print("Average income: $", Math.round(moneysec / 1e3) / 1e3, "m / sec.");
        } else if (moneysec < 1e12) {
            ns.print("Average income: $", Math.round(moneysec / 1e6) / 1e3, "b / sec.");
        } else {
            ns.print("Average income: $", Math.round(moneysec / 1e9) / 1e3, "t / sec.");
        }

    }

    /*~~~~~~~~~~~~~~~~~~~~  Functions  ~~~~~~~~~~~~~~~~~~~~*/

    function TotalPortsExes() {
        if (ns.fileExists("BruteSSH.exe", "home")) {
            var sshEXE = 1;
        } else {
            var sshEXE = 0;
        }
        if (ns.fileExists("FTPCrack.exe", "home")) {
            var ftpEXE = 1;
        } else {
            var ftpEXE = 0;
        }
        if (ns.fileExists("relaySMTP.exe", "home")) {
            var smtpEXE = 1;
        } else {
            var smtpEXE = 0;
        }
        if (ns.fileExists("HTTPWorm.exe", "home")) {
            var httpEXE = 1;
        } else {
            var httpEXE = 0;
        }
        if (ns.fileExists("SQLInject.exe", "home")) {
            var sqlEXE = 1;
        } else {
            var sqlEXE = 0;
        }
        return sshEXE + ftpEXE + smtpEXE + httpEXE + sqlEXE;
    }

    function NukeTarget() {
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
        return ns.nuke(target);
    }

    function BestHost() {
        var purchasedservers = ns.getPurchasedServers(),
            purchasedarray = purchasedservers.length,
            besthost = ns.getServerMaxRam("home") - ns.getServerUsedRam("home"),
            host = "home";
        for (let i = 0; i < purchasedarray; i++) {
            var hostcandidate = ns.getServerMaxRam(purchasedservers[i]) - ns.getServerUsedRam(purchasedservers[i]);
            if (hostcandidate > besthost) {
                var besthost = hostcandidate,
                    host = purchasedservers[i];
            }
        }
        return host;
    }

    /*~~~ Function-ception! Let's play a game of "try to figure out wtf this function is doing"! glhf♥ ~~~*/
    function BestTarget(number) {

        function CalcPercentInstances(target, number) {
            var freeRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host),
                wtime = bestweakentime;
            for (let i = 1; i < 100; i++) {
                var percent = i / 100,
                    hackThdsPerPack = Math.floor(CustomHackAnalyzeThreads(target, percent)),
                    growThdsPerPack = Math.ceil(CustomGrowthAnalyzeThreads(target, percent)),
                    weakThdsPerPack = Math.ceil((0.004 * growThdsPerPack + 0.002 * hackThdsPerPack) / 0.05),
                    packet = (hackThdsPerPack * 1.7 + (growThdsPerPack + weakThdsPerPack) * 1.75),
                    rawinstances = freeRam / packet,
                    instances = Math.floor(rawinstances),
                    instanceTime = wtime / instances,
                    instanceTime16 = instanceTime / 16;
                if (instanceTime16 > unitime && instances < maxinstances && percent < 0.99) {
                    break;
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
            if (number == 0) {
                return percent;
            } else if (number == 1) {
                return instances2;
            }
        }

        function IfStatement() {
            if (number == 0) {
                return true;
            } else if (number == 1) {
                return ns.getServerNumPortsRequired(serverarray[i]) <= TotalPortsExes();
            }
        }

        var serverarray = TargetsList(),
            arraylength = serverarray.length,
            bestserver = 0;
        for (let i = 0; i < arraylength; i++) {
            var bestweakentime = CalcWeakTimeHackChance(serverarray[i], 0),
                besthackchance = CalcWeakTimeHackChance(serverarray[i], 1),
                percent = CalcPercentInstances(serverarray[i], 0),
                bestinstances = CalcPercentInstances(serverarray[i], 1);
            if (
                bestserver <= (percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) * bestinstances) /
                (bestweakentime * (21 / 16)) &&
                ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serverarray[i]) &&
                IfStatement()
            ) {
                var bestserver = percent * besthackchance * ns.getServerMaxMoney(serverarray[i]) *
                    bestinstances / (bestweakentime * (21 / 16)),
                    target = serverarray[i];
            }
        }
        return target;
    }
    /* ^Yes I know this function is unreadable as hell, what of it? I did my best, cry about it LBozoRatioSkissueGitGud */

    function CustomHackAnalyzeThreads(target, percent) {
        return ns.getServerMaxMoney(target) * percent / (
            ns.getServerMaxMoney(target) * ns.hackAnalyze(target) * (
                (100 - ns.getServerMinSecurityLevel(target)) /
                (100 - ns.getServerSecurityLevel(target))
            )
        );
    }

    function CustomGrowthAnalyzeThreads(target, variable) {
        let growthp = 1 / (1 - variable),
            serverGrowthPercentage = ns.getServerGrowth(target) / 100,
            ajdGrowthRatebit = 1 + (1.03 - 1) / ns.getServerSecurityLevel(target);
        if (ajdGrowthRatebit > 1.0035) {
            ajdGrowthRatebit = 1.0035;
        }
        let ajdGrowthRate = 1 + (1.03 - 1) / (
            ns.getServerMinSecurityLevel(target) + hackThdsPerPack * 0.002
        );
        if (ajdGrowthRate > 1.0035) {
            ajdGrowthRate = 1.0035;
        }
        let bitnode = (
            Math.log(growthp) / (
                Math.log(ajdGrowthRatebit) *
                ns.getHackingMultipliers(target).growth *
                (serverGrowthPercentage))
        ) / ns.growthAnalyze(target, growthp);
        return Math.log(growthp) / (
            Math.log(ajdGrowthRate) *
            ns.getHackingMultipliers(target).growth *
            (serverGrowthPercentage) *
            bitnode
        );
    }

    function CalcWeakTimeHackChance(target, number) {
        var reqhacklvl = ns.getServerRequiredHackingLevel(target),
            minseclvl = ns.getServerMinSecurityLevel(target),
            getseclvl = ns.getServerSecurityLevel(target),
            hacktime = ns.getHackTime(target),
            hacklvl = ns.getHackingLevel(target),
            hackchance = ns.hackAnalyzeChance(target);
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
}
