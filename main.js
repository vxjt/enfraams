/*
dps doesnt work
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

const calcbtn = document.querySelector(`#calcbtn`)

const toggles = document.querySelectorAll('.toggleclick')

var gunname, ql, mindmg, maxdmg, critdmg, attacktime, rectime, mbs, fling, burstcycle, ar, inits, damage, crit, flingchar, burst

body.addEventListener("click", event)

function event(e) {
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
  mindmg = Number(inmindmg.value)
  maxdmg = Number(inmaxdmg.value)
  critdmg = Number(incritdmg.value)
  attacktime = Number(inattacktime.value)
  rectime = Number(inrectime.value)
  mbs = Number(inmbs.value)
  burstcycle = Number(inburstcycle.value)
  ar = Number(inar.value)
  inits = Number(ininits.value)
  damage = Number(indamage.value)
  crit = Number(incrit.value)
  flingchar = Number(inflingchar.value)
  burst = Number(inburst.value)

  if (gunname) {
    spanname.innerHTML = `${gunname} ql${ql}`
  } else {
    spanname.innerHTML = `▚▚▚▚▚▚▚▚`
  }

  let ds
  let ds2
  let ds3

  if(mbs < 1000) {
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
  let fulldattackmin = 600 * (attacktime + 1.75 - 1)
  let fulldrecmin = 300 * (rectime + 1.75 - 1)
  let fullaattackmin = 600 * (attacktime - 0.25 - 1)
  let fullarecmin = 300 * (rectime - 0.25 - 1)
  let fullamin = fullaattackmin > fullarecmin ? fullaattackmin : fullarecmin
  let fulldmin = fulldattackmin > fulldrecmin ? fulldattackmin : fulldrecmin

  if (mindmg && maxdmg && critdmg) {
    spanhadmg.innerHTML = `${Math.floor(tmindmg)} (${Math.floor(thacrit)})`
    spanlowdmg.innerHTML = `${Math.floor(tmaxdmg)} (${Math.floor(tlowcrit)}) - ${Math.floor(dmg2)} - ${Math.floor(dmg3)}`
  } else {
    spanhadmg.innerHTML = `▚▚▚▚▚`
    spanlowdmg.innerHTML = `▚▚▚▚▚`
  }

  if (attacktime && rectime) {
    spanfullagg.innerHTML = `${Math.ceil(fullamin)}`
    spanfulldef.innerHTML = `${Math.ceil(fulldmin)}`
  } else {
    spanfullagg.innerHTML = `▚▚`
    spanfulldef.innerHTML = `▚▚`
  }

  let wipspecial = ""

  let flingwepcd, flingcap

  if (infling.innerHTML == "yes" && attacktime) {
    flingwepcd = attacktime + 6
    flingcap = 300 * (5 * attacktime - 2)
    wipspecial += `<span class="resultlabel"><label>fling shot: </label>${flingwepcd}s @ ${Math.ceil(flingcap)}</span>`
  }

  let burstwepcd, burstcap

  if (burstcycle > 0) {
    burstwepcd = attacktime + 8
    burstcap = -25 * attacktime + 500 * rectime + burstcycle / 4 - 200
    wipspecial += `<span class="resultlabel"><label>burst: </label>${burstwepcd}s @ ${Math.ceil(burstcap)}</span>`
  }

  if (wipspecial == "") {
    wipspecial = `<span class="resultlabel">▚▚▚▚▚▚▚▚</span>`
  }

  divspecial.innerHTML = wipspecial

  let simds, simmindmg, simmaxdmg, simhacrit, simlowcrit, avgha, avglow, fulldattack, fulldrec, fullaattack, fullarec, simdpsfullaha, simdpsfulldha, simdpsfullalow, simdpsfulldlow, simflingcd, simflinghadps, simflinglowdps, simburstcd, simbursthadps, simburstlowdps

  if (ar >= 0 && crit >= 0 && damage >= 0 && !isNaN(inits)) {
    simds = (mbs < ar ? mbs : ar + 3375) / 1250
    simmindmg = mindmg * simds + damage
    simmaxdmg = maxdmg * simds + damage
    simhacrit = simds * (mindmg + critdmg) + damage
    simlowcrit = simds * (maxdmg + critdmg) + damage
    crit = crit > 100 ? 100 : crit
    avgha = simmindmg * (1 - crit) + simhacrit * crit
    avglow = simmaxdmg * (1 - crit) + simlowcrit * crit
    fulldattack = 1 > attacktime + 1.75 - inits / 600 ? 1 : attacktime + 1.75 - inits / 600
    fulldrec = 1 > rectime + 1.75 - inits / 300 ? 1 : rectime + 1.75 - inits / 300
    fullaattack = 1 > attacktime - 0.25 - inits / 600 ? 1 : attacktime - 0.25 - inits / 600
    fullarec = 1 > rectime - 0.25 - inits / 300 ? 1 : rectime - 0.25 - inits / 300

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

    simdpsfullaha = avgha / (fullaattack + fullarec) + simbursthadps + simflinghadps
    simdpsfulldha = avgha / (fulldattack + fulldrec) + simbursthadps + simflinghadps
    simdpsfullalow = avglow / (fullaattack + fullarec) + simburstlowdps + simflinglowdps
    simdpsfulldlow = avglow / (fulldattack + fulldrec) + simburstlowdps + simflinglowdps

    spanhasim.innerHTML = `//dmg: ${Math.round(simmindmg)} (${Math.round(simhacrit)}),  dps: ${Math.floor(simdpsfullaha)} agg - ${Math.floor(simdpsfulldha)} def`
    spanlowsim.innerHTML = `//dmg: ${Math.round(simmaxdmg)} (${Math.round(simlowcrit)}),  dps: ${Math.floor(simdpsfullalow)} agg - ${Math.floor(simdpsfulldlow)} def`
  } else {
    spanhasim.innerHTML = `▚▚▚▚▚▚▚▚▚▚`
    spanlowsim.innerHTML = `▚▚▚▚▚▚▚▚▚▚`
  }
}