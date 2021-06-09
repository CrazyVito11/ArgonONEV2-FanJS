const fs  = require('fs');
const fl  = require('firstline');
const i2c = require('i2c-bus');

const fanConfig  = JSON.parse(fs.readFileSync('fan_config.json', 'utf8'));
const i2cBus     = i2c.openSync(fanConfig.i2c_bus);
const fanAddress = fanConfig.i2c_address;
const fanSpeed   = fanConfig.fan_speed;


async function getCPUTemp() {
    const tempRaw = await fl('/sys/class/thermal/thermal_zone0/temp', 'utf8');

    return (Number(tempRaw) / 1000).toFixed(2);
}
async function getCPUSpeed() {
    const tempRaw = await fl('/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq', 'utf8');

    return Number(tempRaw) / 1000;
}

function getFanSpeed(temperature) {
    let speed = 0;

    fanSpeed.forEach((setting) => {
        if (setting.minTemp <= temperature) {
            speed = setting.speed;
        }
    })

    return speed;
}

async function updateFanSpeed() {
    const currentTemp  = await getCPUTemp();
    const currentSpeed = await getCPUSpeed();
    const fanSpeed     = getFanSpeed(currentTemp);

    if (! process.argv.includes('--quiet')) {
        console.log(`[DATA] Temp: ${currentTemp}c, Speed: ${currentSpeed}Mhz, Fan: ${fanSpeed}%`);
    }

    try {
        i2cBus.sendByteSync(fanAddress, fanSpeed);
    } catch(e) {
        console.error(`[FAIL] Fan update failed ${e.message}`)
    }
}


console.log(`-----------------------\n| Argon ONE V2 Fan JS |\n-----------------------`);

setInterval(async() => {
    await updateFanSpeed();
}, 5000);

updateFanSpeed();
