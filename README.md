# Furniture Design & Calculation Tool

A comprehensive online tool for furniture makers to design, calculate materials, optimize cutting, and generate specifications - similar to Базис Мебельщик, Базис Раскрой, and Базис Смета.

## Features

### 🎯 Core Functionality

1. **Geometry Engine** - Automatically calculates all furniture components:
   - Side panels (боковины)
   - Top/Bottom (крышка/дно)
   - Shelves (полки)
   - Partitions (перегородки)
   - Base (цоколь)
   - Back panel (задняя стенка)
   - Doors (фасады)

2. **Materials Calculation** - Optimized sheet cutting algorithm:
   - Automatic nesting on standard sheets (2800x2070mm)
   - Support for ЛДСП, МДФ, Фанера
   - Waste calculation
   - Total square meters

3. **Hardware Calculation** - Automated hardware selection:
   - Hinges (2-3 per door based on height)
   - Drawer slides
   - Screws and connectors (конфирматы, шурупы)
   - Edge banding (0.4mm/2mm)
   - Support legs
   - Handles

4. **3D Preview** - Real-time 3D visualization using Three.js

5. **Specification Export**:
   - PDF export (Карточка изделия)
   - Excel export
   - Full details list
   - Cost breakdown

6. **Cost Calculation** - Complete cost breakdown:
   - Materials cost
   - Hardware cost
   - Edge banding cost
   - Optional labor cost

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **3D Rendering**: Three.js, @react-three/fiber, @react-three/drei
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Export**: jsPDF, jspdf-autotable, xlsx
- **AI Rendering**: OpenAI DALL-E (optional)

## Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   │   ├── geometry/     # Geometry calculations
│   │   ├── cutting/      # Cutting optimization
│   │   ├── hardware/     # Hardware calculations
│   │   ├── render/       # AI render generation
│   │   ├── projects/     # Project CRUD
│   │   └── export/       # PDF/Excel export
│   ├── constructor/      # Main constructor page
│   ├── projects/         # Projects dashboard
│   └── layout.tsx
├── components/           # React components
│   ├── DimensionInput.tsx
│   ├── ModuleEditor.tsx
│   ├── RenderViewer.tsx
│   └── MaterialsTable.tsx
├── lib/                  # Core libraries
│   ├── types.ts          # TypeScript types
│   ├── geometryEngine.ts # Geometry calculations
│   ├── cuttingEngine.ts  # Cutting optimization
│   ├── hardwareEngine.ts # Hardware calculations
│   ├── costCalculator.ts # Cost calculations
│   ├── export.ts         # Export functions
│   ├── database.ts       # Database utilities
│   └── auth.ts           # Authentication
└── package.json
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furniture-design-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
   - `OPENAI_API_KEY` - OpenAI API key (optional, for AI renders)

4. **Set up database**
   ```bash
   # Connect to PostgreSQL and run initialization
   # The database schema will be created automatically on first API call
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## Usage

### Creating a Project

1. Navigate to **Constructor** page
2. Enter furniture dimensions (width, height, depth in mm)
3. Select material type and thickness
4. Configure doors, shelves, and partitions
5. View real-time 3D preview
6. Review materials and cost breakdown
7. Save project or export specifications

### Geometry Engine

The geometry engine automatically calculates all components based on:
- Cabinet dimensions
- Material thickness
- Internal module spacing
- Joinery rules (confirmat, dowels)
- Door gaps (зазоры фасадов)

### Cutting Optimization

The cutting engine uses a bottom-left fill algorithm to:
- Place panels efficiently on standard sheets
- Minimize waste
- Group panels by material and thickness
- Calculate total material usage

### Hardware Calculation

Hardware is automatically calculated based on:
- Door height (hinges: 2 for <800mm, 3 for taller)
- Cabinet size (legs: 4-6 per module)
- Panel count (screws and connectors)
- Edge banding requirements

## API Endpoints

### Geometry
- `POST /api/geometry` - Calculate cabinet geometry

### Cutting
- `POST /api/cutting` - Optimize cutting plan

### Hardware
- `POST /api/hardware` - Calculate hardware requirements

### Render
- `POST /api/render` - Generate AI render (requires OpenAI API)

### Projects
- `GET /api/projects?userId=...` - Get user projects
- `POST /api/projects` - Save new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Export
- `POST /api/export/pdf` - Export to PDF
- `POST /api/export/excel` - Export to Excel

## Database Schema

### Projects Table
- `id` (UUID)
- `user_id` (UUID)
- `name` (VARCHAR)
- `cabinet_data` (JSONB)
- `cutting_plan` (JSONB)
- `hardware` (JSONB)
- `cost` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Materials Table
- `id` (UUID)
- `type` (VARCHAR)
- `thickness` (INTEGER)
- `price_per_square_meter` (DECIMAL)
- `name` (VARCHAR)

### Hardware Prices Table
- `id` (UUID)
- `type` (VARCHAR)
- `price` (DECIMAL)

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Configuration

### Material Prices
Edit hardware prices in `lib/hardwareEngine.ts`:
```typescript
const HARDWARE_PRICES: Record<HardwareType, number> = {
  hinge: 45,
  // ...
}
```

### Sheet Sizes
Default sheet size is 2800x2070mm. Modify in `lib/cuttingEngine.ts`:
```typescript
const STANDARD_SHEET_WIDTH = 2800
const STANDARD_SHEET_HEIGHT = 2070
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
