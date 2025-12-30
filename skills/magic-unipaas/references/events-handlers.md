# Evenements et Handlers Magic Unipaas

## Vue d'Ensemble

Magic Unipaas utilise un systeme d'evenements pour gerer le flux d'execution des programmes.
Les evenements sont definis dans les `LogicUnit` et declenchent des actions specifiques.

---

## 1. Types d'Evenements (EventType)

### Tableau de Reference

| Code | Nom | Description | Moment de Declenchement |
|------|-----|-------------|------------------------|
| `S` | Start | Demarrage | Debut de la tache |
| `F` | Finish | Fin | Fin de la tache |
| `R` | Record | Enregistrement | A chaque enregistrement traite |
| `U` | User | Utilisateur | Evenement defini par l'utilisateur |
| `M` | Menu | Menu | Selection d'un element de menu |
| `P` | Program | Programme | Evenement de programme |
| `I` | Internal | Interne | Evenement systeme interne |

---

## 2. Niveaux de Logique (Level)

### Tableau de Reference

| Code | Nom | Description | Portee |
|------|-----|-------------|--------|
| `R` | Record | Niveau enregistrement | Execute pour chaque enregistrement |
| `T` | Task | Niveau tache | Execute une fois par tache |
| `H` | Handler | Gestionnaire | Repond a un evenement specifique |

---

## 3. Structure XML des Evenements

### 3.1 Evenement dans LogicUnit

```xml
<LogicUnit id="2" propagate="78">
  <Level val="R"/>                   <!-- Niveau: R=Record -->
  <Type val="M"/>                    <!-- Type: M=Main -->
  <Scope val="S"/>                   <!-- Portee: S=Single, G=Global -->

  <Event>
    <EventType val="S"/>             <!-- Type d'evenement: S=Start -->
    <PublicObject comp="-1"/>        <!-- Objet public associe -->
    <ErrorTrigger val="2"/>          <!-- Declencheur d'erreur -->
  </Event>

  <LogicLines>
    <!-- Actions a executer -->
  </LogicLines>
</LogicUnit>
```

### 3.2 Handler d'Evenement

```xml
<LogicUnit id="16" propagate="78">
  <Level val="H"/>                   <!-- H = Handler -->
  <Type val="U"/>                    <!-- U = User-defined handler -->
  <Scope val="G"/>                   <!-- G = Global (capture partout) -->

  <Event>
    <EventType val="U"/>             <!-- Repond aux evenements User -->
    <PublicObject comp="-1" obj="5"/><!-- Evenement public specifique -->
    <ErrorTrigger val="2"/>
  </Event>

  <LogicLines>
    <LogicLine>
      <!-- Actions du handler -->
    </LogicLine>
  </LogicLines>
</LogicUnit>
```

### 3.3 Lever un Evenement (RaiseEvent)

```xml
<LogicLine>
  <RaiseEvent FlowIsn="460">
    <Event>
      <EventType val="U"/>           <!-- Type: User event -->
      <PublicObject comp="-1" obj="2"/><!-- ID de l'evenement -->
    </Event>

    <Wait val="Y"/>                  <!-- Attendre la fin du traitement -->

    <Arguments>
      <Argument>
        <id val="175"/>
        <Expression val="59"/>       <!-- Valeur passee -->
        <Skip val="N"/>
      </Argument>
    </Arguments>

    <Condition val="Y"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </RaiseEvent>
</LogicLine>
```

---

## 4. Cycle de Vie d'une Tache

### Ordre d'Execution des Evenements

```
TACHE DEMARRE
    │
    ▼
┌──────────────────┐
│  Task Prefix     │  Level="T", EventType="S"
│  (Initialisation)│
└────────┬─────────┘
         │
    ┌────▼────┐
    │  BOUCLE │
    │ RECORDS │
    └────┬────┘
         │
    ┌────▼─────────────┐
    │  Record Prefix   │  Level="R", EventType="S"
    │  (Avant chaque   │
    │   enregistrement)│
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Record Main     │  Level="R", EventType="R"
    │  (Traitement     │
    │   principal)     │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Record Suffix   │  Level="R", EventType="F"
    │  (Apres chaque   │
    │   enregistrement)│
    └────────┬─────────┘
             │
    └────────┬─────────┘
         │
         │  (Fin de boucle)
         │
┌────────▼─────────┐
│  Task Suffix     │  Level="T", EventType="F"
│  (Finalisation)  │
└──────────────────┘
         │
         ▼
   TACHE TERMINEE
```

---

## 5. Conversion vers Langages Cibles

### 5.1 TypeScript - Pattern Event-Driven

```typescript
interface MagicEvent {
  type: 'start' | 'finish' | 'record' | 'user' | 'menu' | 'program';
  level: 'task' | 'record' | 'handler';
  data?: unknown;
}

type EventHandler = (event: MagicEvent) => void | Promise<void>;

class MagicTask {
  private handlers: Map<string, EventHandler[]> = new Map();

  // Enregistrer un handler
  on(eventType: string, handler: EventHandler): void {
    const key = eventType;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    this.handlers.get(key)!.push(handler);
  }

  // Lever un evenement
  async raise(event: MagicEvent): Promise<void> {
    const key = event.type;
    const handlers = this.handlers.get(key) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  // Execution de la tache
  async execute(records: unknown[]): Promise<void> {
    // Task Start
    await this.raise({ type: 'start', level: 'task' });

    // Process each record
    for (const record of records) {
      await this.raise({ type: 'start', level: 'record', data: record });
      await this.raise({ type: 'record', level: 'record', data: record });
      await this.raise({ type: 'finish', level: 'record', data: record });
    }

    // Task Finish
    await this.raise({ type: 'finish', level: 'task' });
  }
}

// Exemple d'utilisation
const task = new MagicTask();

task.on('start', (e) => {
  if (e.level === 'task') {
    console.log('Tache demarree');
  }
});

task.on('record', (e) => {
  console.log('Traitement enregistrement:', e.data);
});

task.on('finish', (e) => {
  if (e.level === 'task') {
    console.log('Tache terminee');
  }
});
```

### 5.2 C# - Pattern Event-Driven

```csharp
public enum MagicEventType
{
    Start,
    Finish,
    Record,
    User,
    Menu,
    Program
}

public enum MagicEventLevel
{
    Task,
    Record,
    Handler
}

public class MagicEvent
{
    public MagicEventType Type { get; set; }
    public MagicEventLevel Level { get; set; }
    public object? Data { get; set; }
}

public class MagicTask
{
    public event EventHandler<MagicEvent>? OnStart;
    public event EventHandler<MagicEvent>? OnFinish;
    public event EventHandler<MagicEvent>? OnRecord;
    public event EventHandler<MagicEvent>? OnUser;

    protected virtual void RaiseEvent(MagicEvent e)
    {
        switch (e.Type)
        {
            case MagicEventType.Start:
                OnStart?.Invoke(this, e);
                break;
            case MagicEventType.Finish:
                OnFinish?.Invoke(this, e);
                break;
            case MagicEventType.Record:
                OnRecord?.Invoke(this, e);
                break;
            case MagicEventType.User:
                OnUser?.Invoke(this, e);
                break;
        }
    }

    public async Task ExecuteAsync(IEnumerable<object> records)
    {
        // Task Start
        RaiseEvent(new MagicEvent
        {
            Type = MagicEventType.Start,
            Level = MagicEventLevel.Task
        });

        // Process each record
        foreach (var record in records)
        {
            RaiseEvent(new MagicEvent
            {
                Type = MagicEventType.Start,
                Level = MagicEventLevel.Record,
                Data = record
            });

            RaiseEvent(new MagicEvent
            {
                Type = MagicEventType.Record,
                Level = MagicEventLevel.Record,
                Data = record
            });

            RaiseEvent(new MagicEvent
            {
                Type = MagicEventType.Finish,
                Level = MagicEventLevel.Record,
                Data = record
            });
        }

        // Task Finish
        RaiseEvent(new MagicEvent
        {
            Type = MagicEventType.Finish,
            Level = MagicEventLevel.Task
        });
    }
}
```

### 5.3 Python - Pattern Event-Driven

```python
from enum import Enum
from typing import Callable, Any, Dict, List
from dataclasses import dataclass

class EventType(Enum):
    START = 'start'
    FINISH = 'finish'
    RECORD = 'record'
    USER = 'user'
    MENU = 'menu'
    PROGRAM = 'program'

class EventLevel(Enum):
    TASK = 'task'
    RECORD = 'record'
    HANDLER = 'handler'

@dataclass
class MagicEvent:
    type: EventType
    level: EventLevel
    data: Any = None

EventHandler = Callable[[MagicEvent], None]

class MagicTask:
    def __init__(self):
        self._handlers: Dict[EventType, List[EventHandler]] = {}

    def on(self, event_type: EventType, handler: EventHandler) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)

    def raise_event(self, event: MagicEvent) -> None:
        handlers = self._handlers.get(event.type, [])
        for handler in handlers:
            handler(event)

    def execute(self, records: list) -> None:
        # Task Start
        self.raise_event(MagicEvent(
            type=EventType.START,
            level=EventLevel.TASK
        ))

        # Process each record
        for record in records:
            self.raise_event(MagicEvent(
                type=EventType.START,
                level=EventLevel.RECORD,
                data=record
            ))

            self.raise_event(MagicEvent(
                type=EventType.RECORD,
                level=EventLevel.RECORD,
                data=record
            ))

            self.raise_event(MagicEvent(
                type=EventType.FINISH,
                level=EventLevel.RECORD,
                data=record
            ))

        # Task Finish
        self.raise_event(MagicEvent(
            type=EventType.FINISH,
            level=EventLevel.TASK
        ))


# Exemple d'utilisation
task = MagicTask()

@task.on(EventType.START)
def on_start(event: MagicEvent):
    if event.level == EventLevel.TASK:
        print("Tache demarree")

@task.on(EventType.RECORD)
def on_record(event: MagicEvent):
    print(f"Traitement enregistrement: {event.data}")

task.execute([{"id": 1}, {"id": 2}, {"id": 3}])
```

---

## 6. Evenements Speciaux

### 6.1 Evenements Internes (I)

Les evenements internes sont predéfinis par Magic :

| ID | Description |
|----|-------------|
| 23 | Ouvrir Application |
| 34 | Zoom/Calendar |
| ... | Autres evenements systeme |

### 6.2 Evenements Menu (M)

Declenches par la selection d'un element de menu :

```xml
<MenuEntry id="1">
  <MenuType val="2"/>                <!-- 2 = Program call -->
  <Program comp="-1" obj="21"/>      <!-- Programme a appeler -->
  <SourceContext val="77"/>          <!-- Contexte d'execution -->
</MenuEntry>
```

### 6.3 Propagation (propagate)

L'attribut `propagate` controle si l'evenement continue apres traitement :

```xml
<LogicUnit id="2" propagate="78">
  <!-- propagate="78" : Continue la propagation -->
  <!-- propagate="0" : Arrete la propagation -->
</LogicUnit>
```

---

## 7. Gestion des Erreurs

### ErrorTrigger

```xml
<Event>
  <EventType val="R"/>
  <ErrorTrigger val="2"/>            <!-- Niveau d'erreur declencheur -->
</Event>
```

| Valeur | Niveau |
|--------|--------|
| 0 | Aucune erreur |
| 1 | Warning |
| 2 | Error |
| 3 | Fatal |

### Pattern de Gestion d'Erreur

```typescript
// TypeScript
class MagicErrorHandler {
  private errorLevel: number = 0;

  setError(level: number, message: string): void {
    if (level > this.errorLevel) {
      this.errorLevel = level;
    }
    console.error(`[Level ${level}] ${message}`);
  }

  checkErrorTrigger(triggerLevel: number): boolean {
    return this.errorLevel >= triggerLevel;
  }

  resetError(): void {
    this.errorLevel = 0;
  }
}
```
