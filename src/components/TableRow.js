import Livr from 'livr'
import { states } from './consts'


const TableRow = ({ index, person, setError }) => {
    const data = {
        fullname: person.fullname,
        phone: person.phone,
        email: person.email,
        age: person.age,
        experience: person.experience,
        yearlyIncome: person.yearlyIncome,
        hasChildren: (person.hasChildren !== (null || ' ') ? person.hasChildren : 'False'),
        licenseStates: (person.licenseStates.split('|').join(',')),
        expirationDate: person.expirationDate,
        licenseNumber: person.licenseNumber
    }
    const validator = new Livr.Validator({
        fullname: ['not_empty'],
        phone: ['not_empty', 'custom_number'],
        email: ['trim', 'email', 'to_lc', 'not_empty'],
        age: ['integer', { 'number_between': [21, 95] }],
        experience: ['custom_exp'],
        yearlyIncome: ['positive_decimal', { 'max_number': 1000000 }],
        hasChildren: ['to_uc'],
        licenseStates: ['custom_states','to_uc'],
        expirationDate: ['custom_date'],
        licenseNumber: [{ like: '^[0-9a-zA-Z]{6,6}$' }]
    })

    validator.registerRules({
        custom_date() {
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()
            const re = /^(0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])[/](19|20)\d\d$/ //mm/dd/yyyy
            const re1 = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/ //yyyy-mm-dd 
            return value => {
                if (re.test(value)) {
                    let arr = value.split('/')
                    if (+arr[2] === year) {
                        if (+arr[0] === month) {
                            if (+arr[1] < day) {
                                return 'WRONG_DATE'
                            } else {
                                return
                            }
                        } else if (+arr[0] < month) {
                            return 'WRONG_DATE'
                        } else {
                            return
                        }
                    } else if (+arr[2] < year) {
                        return 'WRONG_DATE'
                    } else {
                        return
                    }
                }
                if (re1.test(value)) {
                    let arr = value.split('-')
                    if (+arr[0] === year) {
                        if (+arr[1] === month) {
                            if (+arr[2] < day) {
                                return 'WRONG_DATE'
                            } else {
                                return
                            }
                        } else if (+arr[1] < month) {
                            return 'WRONG_DATE'
                        } else {
                            return
                        }
                    } else if (+arr[0] < year) {
                        return 'WRONG_DATE'
                    } else {
                        return
                    }
                }
                return 'WRONG_DATE'
            }
        },
        custom_exp() {
            return value => {
                if (+value < 0 || +value > data.age) {
                    return 'WRONG_EXP'
                }
            }
        },
        custom_number() {
            const re = /^[0-9]{3}[0-9]{3}[0-9]{4}$/  // 1234567890
            const re1 = /^1[0-9]{3}[0-9]{3}[0-9]{4}$/ // 11234567890
            const re2 = /^\+1[0-9]{3}[0-9]{3}[0-9]{4}$/ //+11234567890
            return value => {
                if (value === undefined || value === null) return 'WRONG_NUMBER'
                if (value.length > 12) {
                    return 'WRONG_NUMBER'
                } else if (value.length === 10 && re.test(value)) {
                    return
                } else if (value.length === 11 && re1.test(value)) {
                    return
                } else if (value.length === 12 && re2.test(value)) {
                    return
                } return 'WRONG_NUMBER'
            }
        },
        custom_states() {
            return value => {
                let arr = value.split(',')
                if (arr.length > 1) {
                    for (let i = 0; i < arr.length; i++) {
                        if (!states.includes(arr[i])) {
                            return "WRONG_STATES"
                        }
                    }
                }else if(!states.includes(value)) {
                    return "WRONG_STATES"
                }
                
            }
        }
    })
    validator.validate(data)
    const error = validator.getErrors()

    if (error !== null) {
        if (error.fullname === 'CANNOT_BE_EMPTY' || error.phone === 'CANNOT_BE_EMPTY' || error.email === 'CANNOT_BE_EMPTY') {
            setError('Invalid Table! Fields : Fullname, Phone and Email cannot be empty. Please try again')
        }
    }

    return (
        <tr >
            <td >{index}</td>
            <td style={(error !== null && error.fullname) ? { backgroundColor: '#FA8072' } : {}}>{data.fullname}</td>
            <td style={(error !== null && error.phone) ? { backgroundColor: '#FA8072' } : {}}>{data.phone}</td>
            <td style={(error !== null && error.email) ? { backgroundColor: '#FA8072' } : {}}>{data.email}</td>
            <td style={(error !== null && error.age) ? { backgroundColor: '#FA8072' } : {}}>{data.age}</td>
            <td style={(error !== null && error.experience) ? { backgroundColor: '#FA8072' } : {}}>{data.experience}</td>
            <td style={(error !== null && error.yearlyIncome) ? { backgroundColor: '#FA8072' } : {}}>{data.yearlyIncome}</td>
            <td style={(error !== null && error.hasChildren) ? { backgroundColor: '#FA8072' } : {}}>{data.hasChildren}</td>
            <td style={(error !== null && error.licenseStates) ? { backgroundColor: '#FA8072' } : {}} >{data.licenseStates}</td>
            <td style={(error !== null && error.expirationDate) ? { backgroundColor: '#FA8072' } : {}}>{data.expirationDate}</td>
            <td style={(error !== null && error.licenseNumber) ? { backgroundColor: '#FA8072' } : {}}>{data.licenseNumber}</td>
        </tr>
    )
}


export default TableRow;






