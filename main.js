/*
missing special attacks
buttons are ugly
textbox needs more info
better varnames in calc
overflow issues with output flex
go over flex layout again
ensure math.rounds in calc should be rounded and not ceil/floor
gap in the space between the special label and the toggle value
*/

const body = document.querySelector(`body`)
const dev = document.querySelector('#dev')

const spanname = document.querySelector('#gunname')
const spanhadmg = document.querySelector('#hadmg')
const spanhasim = document.querySelector('#hasim')
const spanlowdmg = document.querySelector('#lowdmg')
const spanlowsim = document.querySelector('#lowsim')
const spanfullagg = document.querySelector('#fullagg')
const spanfulldef = document.querySelector('#fulldef')
const divspecial = document.querySelector("#specials")

const inmindmg = document.querySelector('#mindmg')
const inmaxdmg = document.querySelector('#maxdmg')
const incritdmg = document.querySelector('#critdmg')
const inattacktime = document.querySelector('#attacktime')
const inrectime = document.querySelector('#rectime')
const inmbs = document.querySelector('#mbs')
const inburstcycle = document.querySelector('#burstcycle')
const infling = document.querySelector('#fling')

const pastebtn = document.querySelector(`#pastebtn`)
const pastetext = document.querySelector(`#pastetext`)

const inar = document.querySelector('#ar')
const ininits = document.querySelector('#inits')
const indamage = document.querySelector('#damage')
const incrit = document.querySelector('#crit')
const inflingchar = document.querySelector('#flingchar')
const inburst = document.querySelector('#burst')

const spanaggdeflabel = document.querySelector('#aggdeflabel')
const inaggdef = document.querySelector('#aggdef')

const calcbtn = document.querySelector(`#calcbtn`)

const toggles = document.querySelectorAll('.toggleclick')

var gunname, ql, mindmg, maxdmg, critdmg, attacktime, rectime, mbs, fling, burstcycle, ar, inits, damage, crit, flingchar, burst, aggdef

body.addEventListener("click", event)
inaggdef.addEventListener("input", event)

function event(e) {
  if (e.type == 'input') {
    spanaggdeflabel.innerHTML = `${inaggdef.value}`
  } else if (e.type == 'click') {
    switch (e.target) {
      case pastebtn:
        paste(pastetext.value)
        break
      case pastetext:
        if (pastetext.value) {
          pastetext.value = null
        }
        pastebtn.innerHTML = "▲"
        break
      case calcbtn:
        calc()
        break
      default:
        for (let a of toggles) {
          if (e.target == a) {
            toggle(e.target.htmlFor ? document.querySelector(`#${e.target.htmlFor}`) : e.target)
          }
        }

    }
  }
}

function toggle(e) {
  e.innerHTML = e.innerHTML == "yes" ? "no" : "yes"
}

function paste(s) {
  let a = s.match(/^.*/g)
  let b = Number(s.match(/(?<=Quality level: )[\d]+/g))
  let c = s.match(/(?<=Damage: )[\d]+/g)
  let d = s.match(/(?<=Damage: \d+-)[\d]+/g)
  let e = s.match(/(?<=Damage: \d+-\d+\()[\d]+/g)
  let f = s.match(/(?<=Attack )[\d.]+/g)
  let g = s.match(/(?<=Recharge )[\d.]+/g)
  let h = s.match(/(?<=Max beneficial skill: )[\d]+/g)

  if (s.match(/Special:.*FlingShot/g)) {
    infling.innerHTML = "yes"
  }

  if (a && c && d && e && f && g && h) {
    gunname = a
    ql = b
    inmindmg.value = c
    inmaxdmg.value = d
    incritdmg.value = e
    inattacktime.value = f
    inrectime.value = g
    inmbs.value = h
    pastebtn.innerHTML = "✓"
  } else {
    pastebtn.innerHTML = "☹"
  }
}

function calc() {
  mindmg = inmindmg.value != undefined ? Number(inmindmg.value) : undefined
  maxdmg = inmaxdmg.value != undefined ? Number(inmaxdmg.value) : undefined
  critdmg = incritdmg.value != undefined ? Number(incritdmg.value) : undefined
  attacktime = inattacktime.value != undefined ? Number(inattacktime.value) : undefined
  rectime = inrectime.value != undefined ? Number(inrectime.value) : undefined
  mbs = inmbs.value != undefined ? Number(inmbs.value) : undefined
  burstcycle = inburstcycle.value != undefined ? Number(inburstcycle.value) : undefined
  ar = inar.value != undefined ? Number(inar.value) : undefined
  inits = ininits.value != undefined ? Number(ininits.value) : undefined
  damage = Number(indamage.value)
  crit = Number(incrit.value)
  flingchar = inflingchar.value != undefined ? Number(inflingchar.value) : undefined
  burst = inburst.value != undefined ? Number(inburst.value) : undefined
  aggdef = Number(inaggdef.value)

  if (gunname) {
    spanname.innerHTML = `${gunname} ql${ql}`
  } else {
    spanname.innerHTML = `▚▚▚▚▚▚▚▚`
  }

  let ds
  let ds2
  let ds3

  if (mbs < 1000) {
    ds = (mbs + 400) / 400
  } else {
    ds = (mbs + 3375) / 1250
    ds2 = (mbs - 1000) / 1500 * 1.2 + 3.5
    ds3 = (mbs - 1000) / 1500 * 0.6 + 3.5
  }

  let tmindmg = mindmg * ds
  let tmaxdmg = maxdmg * ds
  let dmg2 = ds2 * (maxdmg + critdmg) + 725
  let dmg3 = ds3 * (maxdmg + critdmg) + 725
  let thacrit = ds * (mindmg + critdmg)
  let tlowcrit = ds * (maxdmg + critdmg)

  if (mindmg && maxdmg && critdmg) {
    spanhadmg.innerHTML = `${Math.floor(tmindmg)} (${Math.floor(thacrit)})`
    spanlowdmg.innerHTML = `${Math.floor(tmaxdmg)} (${Math.floor(tlowcrit)})`
  } else {
    spanhadmg.innerHTML = `▚▚▚▚▚`
    spanlowdmg.innerHTML = `▚▚▚▚▚`
  }

  if (attacktime && rectime) {
    spanfullagg.innerHTML = `${Math.ceil(mininit(attacktime, rectime, 100))}`
    spanfulldef.innerHTML = `${Math.ceil(mininit(attacktime, rectime, -100))}`
  } else {
    spanfullagg.innerHTML = `▚▚`
    spanfulldef.innerHTML = `▚▚`
  }

  let wipspecial = ""

  let flingwepcd, flingcap

  if (infling.innerHTML == "yes" && attacktime) {
    flingwepcd = attacktime + 6
    flingcap = 300 * (5 * attacktime - 2)
    wipspecial += `<span class="resultlabel"><label>fling shot: </label>${flingwepcd.toFixed(2)}s @ ${Math.ceil(flingcap)}</span>`
  }

  let burstwepcd, burstcap

  if (burstcycle > 0) {
    burstwepcd = attacktime + 8
    burstcap = -25 * attacktime + 500 * rectime + burstcycle / 4 - 200
    wipspecial += `<span class="resultlabel"><label>burst: </label>${burstwepcd.toFixed(2)}s @ ${Math.ceil(burstcap)}</span>`
  }

  if (wipspecial == "") {
    wipspecial = `<span class="resultlabel">▚▚▚▚▚▚▚▚</span>`
  }

  divspecial.innerHTML = wipspecial

  let simds, simmindmg, simmaxdmg, simhacrit, simlowcrit, avgha, avglow, atkreduce, recreduce, aggdefmod, atktime, rtime, ttime, simdpsfullha, simdpsfulllow, simflingcd, simflinghadps, simflinglowdps, simburstcd, simbursthadps, simburstlowdps

  if (ar && inits && mindmg && maxdmg && critdmg && attacktime && rectime) {
    simds = (mbs < ar ? mbs : ar + 3375) / 1250
    simmindmg = mindmg * simds + damage
    simmaxdmg = maxdmg * simds + damage
    simhacrit = simds * (mindmg + critdmg) + damage
    simlowcrit = simds * (maxdmg + critdmg) + damage
    crit = crit > 100 ? 1 : crit / 100
    avgha = simmindmg * (1 - crit) + simhacrit * crit
    avglow = simmaxdmg * (1 - crit) + simlowcrit * crit

    if (inits > 1200) {
      atkreduce = (inits - 1200) / 1200 + 2
      recreduce = (inits - 1200) / 1200 + 4
    } else {
      atkreduce = inits / 600
      recreduce = inits / 300
    }

    aggdefmod = 0.75 - 0.01 * aggdef

    atktime = attacktime - atkreduce + aggdefmod < 1 ? 1 : attacktime - atkreduce + aggdefmod
    rtime = rectime - recreduce + aggdefmod < 1 ? 1 : rectime - recreduce + aggdefmod
    ttime = atktime + rtime

    if (flingchar > 0 && infling.innerHTML == "yes") {
      simflingcd = flingwepcd < attacktime * 16 - flingchar / 100 ? attacktime * 16 - flingchar / 100 : flingwepcd
      simflinghadps = avgha / simflingcd
      simflinglowdps = avglow / simflingcd
    } else {
      simflinghadps = 0
      simflinglowdps = 0
    }

    if (burst > 0 && burstcycle > 0) {
      simburstcd = burstwepcd < rectime * 20 + burstcycle / 100 - burst / 25 ? rectime * 20 + burstcycle / 100 - burst / 25 : burstwepcd
      simbursthadps = simmindmg * 3 / simburstcd
      simburstlowdps = simmaxdmg * 3 / simburstcd
    } else {
      simbursthadps = 0
      simburstlowdps = 0
    }

    simdpsfullha = avgha / ttime + simbursthadps + simflinghadps
    simdpsfulllow = avglow / ttime + simburstlowdps + simflinglowdps

    spanhasim.innerHTML = `//dmg: ${Math.round(simmindmg)} (${Math.round(simhacrit)}),  dps: ${Math.floor(simdpsfullha)}`
    spanlowsim.innerHTML = `//dmg: ${Math.round(simmaxdmg)} (${Math.round(simlowcrit)}),  dps: ${Math.floor(simdpsfulllow)}`
  } else {
    spanhasim.innerHTML = `▚▚▚▚▚▚▚▚▚▚`
    spanlowsim.innerHTML = `▚▚▚▚▚▚▚▚▚▚`
  }
}

function mininit(a, r, ad) {
  let mod = 0.75 - 0.01 * ad

  if (a + mod - 1 > 2) {
    a = 1200 * (a + mod - 3) + 1200
  } else {
    a = 600 * (a + mod - 1)
  }
  if (r + mod - 1 > 4) {
    r = 1200 * (r + mod - 5) + 1200
  } else {
    r = 300 * (r + mod - 1)
  }

  return a > r ? a : r
}