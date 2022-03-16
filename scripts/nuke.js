/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.args[0];
	var openPorts = 0;
	if(ns.fileExists("BruteSSH.exe")) {
		ns.brutessh(host);
		openPorts++;
	}

	if(ns.fileExists("FTPCrack.exe")) {
		ns.ftpcrack(host);
		openPorts++;
	}

	if(ns.fileExists("relaySMTP.exe")) {
		ns.relaysmtp(host);
		openPorts++;	
	}

	if(ns.fileExists("HTTPWorm.exe")) {
		ns.httpworm(host);
		openPorts++;
	}

	if(ns.fileExists("SQLInject.exe")) {
		ns.sqlinject(host);
		openPorts++;
	}

	if (openPorts >= ns.getServerNumPortsRequired(host)) {
		ns.nuke(host);
	}
}