const db = require('../db')
const { check, body } = require('express-validator')

const createProduct = [
    check('brand').not().isEmpty().withMessage('Brand is required'),
    // check('model').not().isEmpty().withMessage('Model is required').custom(async(value) => {
    //     const sql = `SELECT * FROM products WHERE model = "${value}"`
    //     const res = await db.query(sql)
    //     if(res?.[0]?.[0]){
    //         throw new Error('A product with such model name already exists')
    //     }
    // }),
    check('price_original').not().isEmpty().isNumeric().withMessage('Copy Price must be numeric'),
    check('price_copy').not().isEmpty().isNumeric().withMessage('Original Price must be numeric'),
    // check('detail_number')
    //     .not()
    //     .isEmpty()
    //     .withMessage('Detail number is required'),
    check('category_id')
        .not()
        .isEmpty()
        .withMessage('Category id is required'),
    check('category_name')
        .not()
        .isEmpty()
        .withMessage('Category name is required'),
    // body('refs').not().isEmpty().withMessage('Reference/s is required').custom(async(value) => {
    //     const refs = JSON.parse(value)
    //     let sql = refs.reduce((acc, ref) => {
    //         acc += `"${ref.ref_num}", `
    //         return acc
    //     }, `SELECT * FROM refs WHERE ref_num IN(`)
    //     sql = sql.slice(0, -2)
    //     sql += ")"
    //     const res = await db.promise().query(sql)
    //     if(res?.[0].length){
    //         throw new Error('Specified reference/s already exist');
    //     }
    // })
]

const updateProduct = [
    check('brand').optional().trim().isLength({min: 1}).withMessage('Brand must not be empty'),
    // check('model').optional().trim().isLength({min: 1}).withMessage('Model must not be empty'),
    // check('detail_number').optional().trim().isLength({min: 1}).withMessage('Detail number must not be empty'),
    check('ref_num').optional().trim().isLength({min: 1}).withMessage('Reference number must not be empty'),
]

const createIgnitionCoils = [
    ...createProduct,
    check('plugs_number')
        .not()
        .isEmpty()
        .withMessage('Plugs number is required')
        .isIn(['1', '2'])
        .withMessage('Plugs number must be 1/2'),
    check('contacts_number')
        .not()
        .isEmpty()
        .withMessage('Contacts number is required')
        .isIn(['1', '2', '3', '4'])
        .withMessage('Contacts number must be 1/2/3/4'),
]

const updateIgnitionCoils = [
    ...updateProduct,
    check('plugs_number')
        .optional()
        .isIn(['1', '2'])
        .withMessage('Plugs number must be 1/2'),
    check('contacts_number')
        .optional()
        .isIn(['1', '2', '3', '4'])
        .withMessage('Contacts number must be 1/2/3/4'),
]

const createSparkPlugs = [
    ...createProduct,
    check('key_type')
        .not()
        .isEmpty()
        .withMessage('Key type is required')
        .isIn(['шестигранник', 'многогранник'])
        .withMessage('Key type must be шестигранник/многогранник'),
    check('key_size')
        .not()
        .isEmpty()
        .withMessage('Key size is required')
        .isIn(['12', '14', '16', '21'])
        .withMessage('Key size must be 12/16/21'),
    check('seat_type')
        .not()
        .isEmpty()
        .withMessage('Seat type is required')
        .isIn(['конический', 'шайбовый'])
        .withMessage('Seat type must be конический/шайбовый'),
    check('thread_size')
        .not()
        .isEmpty()
        .withMessage('Thread size is required')
        .isNumeric()
        .withMessage('Thread size must be numeric value'),
    check('thread_length')
        .not()
        .isEmpty()
        .withMessage('Thread length is required')
        .isNumeric()
        .withMessage('Thread length must be numeric value'),
    check('gap')
        .not()
        .isEmpty()
        .withMessage('Gap is required')
        .isNumeric()
        .withMessage('Gap must be numeric value'),
    check('electrodes_number')
        .not()
        .isEmpty()
        .withMessage('Electrodes number is required')
        .isIn(['1', '2', '3', '4'])
        .withMessage('Electrodes number must be 1/2/3/4'),
    check('electrode_type')
        .not()
        .isEmpty()
        .withMessage('Electrode type is required')
        .isIn(['медь', 'платина', 'иридий'])
        .withMessage('Electrodes number must be медь/платина/иридий'),
]

const updateSparkPlugs = [
    ...updateProduct,
    check('key_type')
        .optional()
        .isIn(['шестигранник', 'многогранник'])
        .withMessage('Key type must be шестигранник/многогранник'),
    check('key_size')
        .optional()
        .isIn(['12', '14', '16', '21'])
        .withMessage('Key size must be 12/16/21'),
    check('seat_type')
        .optional()
        .isIn(['конический', 'шайбовый'])
        .withMessage('Seat type must be конический/шайбовый'),
    check('thread_size')
        .optional()
        .isNumeric()
        .withMessage('Thread size must be numeric value'),
    check('thread_length')
        .optional()
        .isNumeric()
        .withMessage('Thread length must be numeric value'),
    check('gap')
        .optional()
        .isNumeric()
        .withMessage('Gap must be numeric value'),
    check('electrodes_number')
        .optional()
        .isIn(['1', '2', '3', '4'])
        .withMessage('Electrodes number must be 1/2/3/4'),
    check('electrode_type')
        .optional()
        .isIn(['медь', 'платина', 'иридий'])
        .withMessage('Electrodes number must be медь/платина/иридий'),
]

const createAirbagCables = [
    ...createProduct,
    check('steering_axle_bore_diameter')
        .not()
        .isEmpty()
        .withMessage('Steering axle bore diameter is required')
        .isNumeric()
        .withMessage('Steering axle bore diameter must be numeric value'),
    check('airbag_plugs_number')
        .not()
        .isEmpty()
        .withMessage('Airbag plugs number is required')
        .isNumeric()
        .withMessage('Airbag plugs number must be numeric value'),
]

const updateAirbagCabels = [
    ...updateProduct,
    check('steering_axle_bore_diameter')
        .optional()
        .isNumeric()
        .withMessage('Steering axle bore diameter must be numeric value'),
    check('airbag_plugs_number')
        .optional()
        .isNumeric()
        .withMessage('Airbag plugs number must be numeric value'),
]

const createCrankshaftCamshaftSensors = [
    ...createProduct,
    check('wired')
        .isNumeric()
        .withMessage('Wired must be numeric value'),
    check('contact_number')
        .not()
        .isEmpty()
        .withMessage('Contact number is required')
        .isIn(['1', '2', '3'])
        .withMessage('Contact number must be 1/2/3'),
    check('connection_type')
        .not()
        .isEmpty()
        .withMessage('Connection type is required')
        .isIn(['кругло-квалратный', 'круглый', 'квадратный'])
        .withMessage(
            'Connection type must be кругло-квалратный/круглый/квадратный'
        ),
]

const updateCrankshaftCamshaftSensors = [
    ...updateProduct,
    check('wired')
        .isNumeric()
        .withMessage('Wired must be numeric value'),
    check('contact_number')
        .optional()
        .isIn(['1', '2', '3'])
        .withMessage('Contact number must be 1/2/3'),
    check('connection_type')
        .optional()
        .isIn(['кругло-квалратный', 'круглый', 'квадратный'])
        .withMessage(
            'Connection type must be кругло-квалратный/круглый/квадратный'
        ),
]


const createIgnitionCoilMouthpieces = [
    ...createProduct,
    check('wired')
        .isNumeric()
        .withMessage('Wired must be numeric value'),
    check('type_')
        .not()
        .isEmpty()
        .withMessage('Type is required')
        .isIn(['резиновый', 'фибр'])
        .withMessage(
            'Type must be резиновый/фибр'
        ),
    check('contact_type')
        .not()
        .isEmpty()
        .withMessage('Contact type is required')
        .isIn(['пружина', 'пружина + резистор'])
        .withMessage(
            'Contact type must be пружина/пружина + резистор'
        )
]

const updateIgnitionCoilMouthpieces = [
    ...updateProduct,
    check('wired')
        .optional()
        .isNumeric()
        .withMessage('Wired must be numeric value'),
    check('type_')
        .optional()
        .isIn(['резиновый', 'фибр'])
        .withMessage(
            'Type must be резиновый/фибр'
        ),
    check('contact_type')
        .optional()
        .isIn(['пружина', 'пружина + резистор'])
        .withMessage(
            'Contact type must be пружина/пружина + резистор'
        )
]

module.exports = {
    createSparkPlugs,
    createIgnitionCoils,
    createAirbagCables,
    createCrankshaftCamshaftSensors,
    createIgnitionCoilMouthpieces,
    updateIgnitionCoilMouthpieces,
    updateCrankshaftCamshaftSensors,
    updateSparkPlugs,
    updateIgnitionCoils,
    updateAirbagCabels
}
