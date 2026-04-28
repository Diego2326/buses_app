# API Mobile - Endpoints Faltantes

Documento para backend con lo que todavía hace falta exponer o mejorar para que la app móvil de pasajeros quede completa.

- Base URL esperada: `https://<host>/api/v1`
- Fecha de referencia de este documento: `2026-04-28`

## 1. Registro público de pasajeros

### Falta: `POST /auth/register`

Hoy la app no puede crear cuentas reales porque el backend no expone registro público.

Body sugerido:

```json
{
  "name": "Ana Morales",
  "email": "ana@buses.gt",
  "password": "123456"
}
```

Response sugerida:

```json
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "name": "Ana Morales",
    "email": "ana@buses.gt",
    "role": "PASSENGER",
    "status": "ACTIVE"
  }
}
```

## 2. Lookup directo de bus por código

### Recomendado: `GET /buses/by-code/{code}`

Hoy la app busca por `GET /buses?search=BUS-102`, pero eso depende de que el buscador haga match exacto por código.

Response sugerida:

```json
{
  "id": "uuid",
  "plate": "C 102 BAA",
  "code": "BUS-102",
  "capacity": 55,
  "route": {
    "id": "uuid",
    "name": "Ruta 12 Centro",
    "origin": "Terminal Oriente",
    "destination": "Parque Central"
  },
  "status": "ACTIVE"
}
```

## 3. Resumen de ruta dentro del bus

### Mejora recomendada en `GET /buses`

Para móvil conviene que el objeto `route` ya incluya:

- `origin`
- `destination`

Así se evita hacer `GET /routes/{id}` adicional por cada bus consultado.

Formato recomendado:

```json
{
  "id": "uuid",
  "plate": "C 102 BAA",
  "code": "BUS-102",
  "capacity": 55,
  "route": {
    "id": "uuid",
    "name": "Ruta 12 Centro",
    "origin": "Terminal Oriente",
    "destination": "Parque Central"
  },
  "status": "ACTIVE"
}
```

## 4. Respuesta enriquecida de pagos

### Mejora recomendada en `POST /payments` y `GET /payments/{id}`

Hoy la API devuelve:

- `user` como nombre
- `bus` como código

Para móvil conviene devolver además:

- `userId`
- `busId`
- `busPlate`
- `routeName`
- `routeOrigin`
- `routeDestination`

Response sugerida:

```json
{
  "id": "uuid",
  "userId": "uuid",
  "user": "Ana Morales",
  "busId": "uuid",
  "bus": "BUS-102",
  "busPlate": "C 102 BAA",
  "routeName": "Ruta 12 Centro",
  "routeOrigin": "Terminal Oriente",
  "routeDestination": "Parque Central",
  "amount": 4.0,
  "date": "2026-04-28T14:15:00Z",
  "status": "COMPLETED",
  "method": "QR"
}
```

## 5. Wallet real para pasajeros

Hoy el saldo en la app sigue siendo local porque el backend no expone billetera para pasajero.

### Faltan:

- `GET /wallet`
- `POST /wallet/top-ups`
- `GET /wallet/transactions`

### `GET /wallet`

Response sugerida:

```json
{
  "balance": 42.5,
  "currency": "GTQ"
}
```

### `POST /wallet/top-ups`

Body sugerido:

```json
{
  "amount": 20.0,
  "method": "CARD"
}
```

Response sugerida:

```json
{
  "id": "uuid",
  "amount": 20.0,
  "status": "COMPLETED",
  "date": "2026-04-28T15:00:00Z"
}
```

### `GET /wallet/transactions`

Response sugerida:

```json
{
  "content": [
    {
      "id": "uuid",
      "type": "TOP_UP",
      "amount": 20.0,
      "date": "2026-04-28T15:00:00Z",
      "status": "COMPLETED"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

## 6. Prioridad sugerida

### Alta

- `POST /auth/register`
- enriquecer `GET /buses` con `origin` y `destination`
- enriquecer respuestas de pagos

### Media

- `GET /buses/by-code/{code}`

### Para experiencia completa de pasajero

- `GET /wallet`
- `POST /wallet/top-ups`
- `GET /wallet/transactions`

