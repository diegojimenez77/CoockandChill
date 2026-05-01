import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'Assets', 'data', 'demo-solicitudes.json');

const PEXELS = [
    'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2342208/pexels-photo-2342208.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4207784/pexels-photo-4207784.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6800146/pexels-photo-6800146.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5767936/pexels-photo-5767936.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6542637/pexels-photo-6542637.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3639433/pexels-photo-3639433.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/6969867/pexels-photo-6969867.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4259140/pexels-photo-4259140.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4109118/pexels-photo-4109118.jpeg?auto=compress&cs=tinysrgb&w=800'
];

/** PDF de ejemplo externo (campo lleno para demo; no es el PDF del formulario Machote). */
const PDF_DEMO_EJEMPLO = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const clientes = [
    'Carnes del Norte', 'La Terraza Bistro', 'Hospital Vitalis', 'Hotel Aurora CDMX', 'Panadería El Fermento',
    'Sushi Bar Azul', 'Taquería Don Lupe', 'Café Bruma', 'Laboratorio Clínico Medix', 'Escuela Gastronómica Sur',
    'Restaurante Alameda', 'Catering Elegante', 'Pescados y Mariscos Pacífico', 'Heladería Polar', 'Comedor Industrial GM',
    'Bodega Frío Sur', 'Pizzería Forno', 'Mercado Gourmet 12', 'Comedores Escolares Unidos', 'Club Deportivo Aqua',
    'Mariscos La Perla', 'Vinos y Tapas', 'Comida Hospitalaria Norte', 'Refrigerados del Valle', 'Cocina Central Aeropuerto',
    'Buffet Internacional', 'Ensaladas Urbanas', 'Food Truck Norte', 'Molino de Grano', 'Lácteos La Pradera'
];

const marcas = ['Rational', 'Hoshizaki', 'Infrico', 'Tecumseh', 'Carrier', 'True', 'Turbo Air', 'Delfield', 'Beverage-Air', 'Traulsen', 'Ice-o-matic', 'Victory', 'Foster', 'Arneg', 'Ugur'];
const tipos = ['REVISION', 'REPARACION', 'MANTENIMIENTO'];
const refEst = ['COLOCADAS', 'POR_COTIZAR', 'SIN_REFACCIONES'];
const distribuidores = ['Equipos Pro S.A.', 'Frío Total', 'Distribuidora Metropolitana', 'ServiHoreca', 'Importadora Z MG'];
const calles = ['Reforma', 'Insurgentes', 'Universidad', 'Cuauhtémoc', 'Patriotismo', 'División', 'Eugenia', 'Coyoacán', 'Tlalpan', 'Mixcoac'];
const cols = ['Centro', 'Del Valle', 'Narvarte', 'Roma', 'Condesa', 'Polanco', 'Azcapotzalco', 'Iztapalapa', 'Coyoacán', 'Tlalpan'];

function pick(i, j) {
    return PEXELS[(i * 3 + j) % PEXELS.length];
}

function gpsFor(i) {
    const lat = (19.38 + (i % 10) * 0.012 + (i % 3) * 0.002).toFixed(5);
    const lng = (-99.15 + (i % 8) * 0.015 - (i % 4) * 0.003).toFixed(5);
    return { lat, lng };
}

function comentariosPara(estado, i) {
    const base = [
        { fecha: '15/01/2025 09:15:12', autor: 'Recepción Cook & Chill', texto: 'Solicitud registrada en sistema. Folio asignado.' },
        { fecha: '15/01/2025 11:40:00', autor: 'Admin Principal', texto: 'Revisando documentación y fotografías del equipo.' }
    ];
    if (estado === 'ASIGNADA' || estado === 'CERRADA') {
        base.push({ fecha: '16/01/2025 08:00:00', autor: 'Coordinación', texto: 'Asignado técnico para visita de diagnóstico.' });
    }
    if (estado === 'CERRADA') {
        base.push({ fecha: '17/01/2025 14:30:00', autor: 'Técnico Roberto', texto: 'Se realizó servicio; se verificó presión y sellos. Cliente firmó acta.' });
        base.push({ fecha: '17/01/2025 18:00:00', autor: 'Admin Principal', texto: 'Orden cerrada y archivada.' });
    }
    return base;
}

const modelos = ['ICP-6', 'IM-450', 'NPT330', 'AE4440', '5H120', 'TUC-48', 'RCB480', 'UCR60A', 'BM23', 'RLD232W', 'SY3654', 'T49HC'];
const problemas = [
    'temperatura alta en cámara', 'ruido en ventilador condensador', 'escarcha excesiva en evaporador', 'alarma de fallo eléctrico',
    'puerta con fuga de burlete', 'ciclo corto del compresor', 'display sin encender', 'vibración anómala', 'consumo elevado', 'olores en el condensado'
];

const firmaSvg = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="10" y="48" font-family="sans-serif" font-size="18" fill="#1f2937">Firma cliente (demo)</text></svg>'
);

const out = [];
for (let i = 0; i < 30; i += 1) {
    const estado = i < 10 ? 'EN_REVISION' : (i < 20 ? 'ASIGNADA' : 'CERRADA');
    const id = `SOL-DEMO-${String(i + 1).padStart(3, '0')}`;
    const dia = String(27 - Math.floor(i / 3)).padStart(2, '0');
    const fecha = `2025-02-${dia}`;

    out.push({
        id,
        cliente: clientes[i],
        fecha,
        ubicacion: `Av. ${calles[i % 10]} ${1000 + i * 37}, Col. ${cols[i % 10]}, Ciudad de México`,
        equipo: {
            marca: marcas[i % marcas.length],
            modelo: modelos[i % modelos.length],
            serie: `SN-DEMO-${2025000 + i}`,
            amperaje: ['6.2 A', '4.8 A', '5.5 A', '7.1 A'][i % 4],
            voltaje: ['115 V', '220 V', '208 V'][i % 3],
            presion: ['R134a 12 PSI', 'R404A 18 PSI', 'R290 10 PSI'][i % 3],
            temp_ambiente: ['24 °C', '26 °C', '22 °C'][i % 3],
            temp_cabina: ['2 °C', '-18 °C', '4 °C'][i % 3],
            distribuidor: distribuidores[i % distribuidores.length]
        },
        estado,
        tipo_servicio: tipos[i % 3],
        garantia: i % 2 === 0,
        refacciones_estado: refEst[i % 3],
        diagnostico:
            estado === 'CERRADA'
                ? 'Compresor operando dentro de rango. Se reemplazó relé de arranque. Se selló fuga menor en línea de succión. Equipo calibrado a +2 °C en cámara.'
                : (estado === 'ASIGNADA' ? 'Diagnóstico pendiente de visita en sitio.' : ''),
        tecnico_id: estado === 'EN_REVISION' ? null : 2,
        cliente_usuario_id: i % 4 === 0 ? 3 : null,
        distribuidor: distribuidores[(i + 1) % distribuidores.length],
        observaciones: `Cliente reporta ${problemas[i % 10]}. Equipo en operación crítica para el negocio.`,
        gps: gpsFor(i),
        fotos_base64: {
            eq1: pick(i, 0),
            eq2: pick(i, 1),
            eq3: pick(i, 2),
            placa: pick(i, 3)
        },
        pdf_document: PDF_DEMO_EJEMPLO,
        comentarios: comentariosPara(estado, i),
        firma_cliente: estado === 'CERRADA' ? firmaSvg : ''
    });
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Written', out.length, 'records to', outPath);
