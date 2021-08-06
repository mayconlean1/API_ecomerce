// sql usa TIMESTAMP em horario local
const date = new Date('2021-07-06 21:20:07')

console.log(

date
)

function UTCDateDatabase (dateValue = ''){

    const date = dateValue === ''? new Date () : new Date (dateValue)
    const year = '0000'+ date.getUTCFullYear()
    const y = year.slice(-4)
    const mounth = '00'+ date.getUTCMonth()
    const m = mounth.slice(-2)
    const day = '00'+ date.getUTCDate()
    const d = day.slice(-2)

    const hour ='00'+ date.getUTCHours()
    const hr = hour.slice(-2)
    const min = '00'+date.getUTCMinutes()
    const mn = min.slice(-2)
    const sec = '00'+ date.getUTCSeconds()
    const sc = sec.slice(-2)

    const fullDate = [y,m,d].join('-')
    const fullHour = [hr,mn,sc].join(':')

    return `${fullDate} ${fullHour}`

}

console.log(UTCDateDatabase() )