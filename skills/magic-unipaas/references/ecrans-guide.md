# Guide Complet des Ecrans (Forms/UI) Magic Unipaas

## Metadata
- **Date**: 2025-12-24
- **Source**: Analyse fichiers ADH avec Forms GUI
- **Statut**: COMPLET

---

## 1. Vue d'ensemble

Les ecrans Magic sont definis dans les `<TaskForms>` et contiennent:
- Formulaires GUI interactifs
- Controles de saisie et affichage
- Evenements utilisateur
- Liaison avec les donnees

---

## 2. Types de Formulaires

### 2.1 FORM_GUI0 - Formulaire standard

Formulaire d'ecran interactif principal.

```xml
<FormEntry id="2">
  <PropertyList model="FORM_GUI0">
    <X id="21" val="555"/>
    <Y id="22" val="12"/>
    <Width id="23" val="422"/>
    <Height id="24" val="56"/>
    <SystemMenu id="27"/>             <!-- Menu systeme -->
    <MinimizeButton id="28"/>         <!-- Bouton minimiser -->
    <MaximizeButton id="29"/>         <!-- Bouton maximiser -->
    <HorizontalFactor id="35" val="8"/>
    <FormName id="311" valUnicode="Titre fenetre"/>
    <WindowType id="358" val="1"/>    <!-- Type de fenetre -->
  </PropertyList>
  <!-- Controles enfants -->
</FormEntry>
```

### 2.2 Attributs de formulaire

| Attribut | ID | Description |
|----------|-----|-------------|
| X | 21 | Position horizontale |
| Y | 22 | Position verticale |
| Width | 23 | Largeur |
| Height | 24 | Hauteur |
| SystemMenu | 27 | Afficher menu systeme |
| MinimizeButton | 28 | Bouton minimiser |
| MaximizeButton | 29 | Bouton maximiser |
| FormName | 311 | Titre de la fenetre |
| WindowType | 358 | Type de fenetre |
| Color | 51 | Couleur de fond |

---

## 3. Types de Controles

### 3.1 Liste complete des controles

| Model | Nom | Description |
|-------|-----|-------------|
| **CTRL_GUI0_STATIC** | Static | Texte statique, libelle |
| **CTRL_GUI0_EDIT** | Edit | Champ de saisie |
| **CTRL_GUI0_PUSH_BUTTON** | Button | Bouton cliquable |
| **CTRL_GUI0_TABLE** | Table | Tableau/grille de donnees |
| **CTRL_GUI0_COLUMN** | Column | Colonne de tableau |
| **CTRL_GUI0_CHECKBOX** | CheckBox | Case a cocher |
| **CTRL_GUI0_RADIO** | Radio | Bouton radio |
| **CTRL_GUI0_COMBO** | ComboBox | Liste deroulante |
| **CTRL_GUI0_LIST** | ListBox | Liste de selection |
| **CTRL_GUI0_IMAGE** | Image | Image/icone |
| **CTRL_GUI0_LINE** | Line | Trait |
| **CTRL_GUI0_SUBFORM** | SubForm | Sous-formulaire imbrique |
| **CTRL_GUI0_TAB** | Tab | Onglets |
| **CTRL_GUI0_GROUP** | GroupBox | Cadre de groupe |
| **CTRL_GUI0_BROWSER** | Browser | Navigateur web |
| **CTRL_GUI0_TREE** | TreeView | Arborescence |
| **CTRL_GUI0_RICH** | RichEdit | Editeur riche |

---

## 4. Attributs communs des controles

### 4.1 Position et dimensions

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_EDIT">
    <X id="21" val="10"/>         <!-- Position X -->
    <Y id="22" val="30"/>         <!-- Position Y -->
    <Width id="23" val="100"/>    <!-- Largeur -->
    <Height id="24" val="20"/>    <!-- Hauteur -->
  </PropertyList>
</Control>
```

### 4.2 Apparence

| Attribut | ID | Valeurs | Description |
|----------|-----|---------|-------------|
| Font | 50 | code | Police de caracteres |
| Color | 51 | 1-16 | Couleur |
| Visible | 61 | exp | Expression visibilite |
| Style | 63 | 1-7 | Style visuel |
| HorizontalAlignment | 65 | 1/2/3 | Alignement (G/C/D) |
| VerticalAlignment | 66 | 1/2/3 | Alignement (H/M/B) |

### 4.3 Liaison donnees

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_EDIT">
    <Model ID="MODEL_GUI_INT" id="1">
      <Var FieldID="5"/>           <!-- Reference au champ -->
    </Model>
    <Data FieldID="5" id="43"/>    <!-- Champ lie -->
    <ControlName id="46" val="monChamp"/>  <!-- Nom du controle -->
    <Format id="82" valUnicode="###"/>     <!-- Format affichage -->
  </PropertyList>
</Control>
```

### 4.4 Comportement

| Attribut | ID | Description |
|----------|-----|-------------|
| TabOrder | 314 | Ordre de tabulation |
| AllowParking | 315 | Focus autorise (Y/N) |
| AllowedDirection | 317 | Direction navigation |
| Enabled | exp | Expression activation |

---

## 5. Controles detailles

### 5.1 CTRL_GUI0_STATIC (Texte statique)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_STATIC">
    <Text id="19" valUnicode="Mon libelle"/>
    <X id="21" val="10"/>
    <Y id="22" val="10"/>
    <Width id="23" val="100"/>
    <Height id="24" val="14"/>
    <Font id="50" val="33"/>      <!-- Font 33 = Arial Bold -->
    <Color id="51" val="6"/>      <!-- 6 = Blanc -->
    <Style id="63" val="7"/>      <!-- 7 = transparent -->
    <HorizontalAlignment id="65" val="2"/>  <!-- 2 = centre -->
  </PropertyList>
</Control>
```

### 5.2 CTRL_GUI0_EDIT (Champ de saisie)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_EDIT">
    <Model ID="MODEL_GUI_INT" id="1">
      <Var FieldID="10"/>
    </Model>
    <X id="21" val="100"/>
    <Y id="22" val="50"/>
    <Width id="23" val="150"/>
    <Height id="24" val="18"/>
    <Data FieldID="10" id="43"/>
    <ControlName id="46" val="txtNom"/>
    <Style id="63" val="1"/>
    <TabOrder id="314" val="1"/>
    <AllowParking id="315" val="Y"/>
  </PropertyList>
</Control>
```

### 5.3 CTRL_GUI0_PUSH_BUTTON (Bouton)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_PUSH_BUTTON">
    <X id="21" val="200"/>
    <Y id="22" val="100"/>
    <Width id="23" val="80"/>
    <Height id="24" val="25"/>
    <ControlName id="46" val="btnValider"/>
    <Font id="50" val="33"/>
    <Format id="82" valUnicode="Valider"/>  <!-- Texte bouton -->
    <RaiseEvent id="234">
      <EventType val="I"/>
      <InternalEventID val="220"/>          <!-- 220 = OK/Continuer -->
      <PublicObject comp="-1"/>
    </RaiseEvent>
    <TabOrder id="314" val="10"/>
  </PropertyList>
</Control>
```

### 5.4 CTRL_GUI0_TABLE (Tableau)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_TABLE">
    <X id="21" val="10"/>
    <Y id="22" val="50"/>
    <Width id="23" val="500"/>
    <Height id="24" val="200"/>
    <TitleHeight id="79" val="20"/>   <!-- Hauteur en-tete -->
    <RowHeight id="80" val="15"/>     <!-- Hauteur ligne -->
    <Elements id="81" val="10"/>      <!-- Nombre colonnes -->
    <MultiMarking id="196"/>          <!-- Selection multiple -->
  </PropertyList>
</Control>
```

### 5.5 CTRL_GUI0_COLUMN (Colonne de tableau)

```xml
<Control ISN_FATHER="1" id="2">
  <PropertyList model="CTRL_GUI0_COLUMN">
    <Width id="23" val="80"/>
    <ControlLayer id="25" val="1"/>        <!-- Position colonne -->
    <Sortable id="134" val="Y"/>           <!-- Triable -->
    <ColumnTitle id="139" valUnicode="Nom"/>  <!-- Titre -->
  </PropertyList>
</Control>
```

### 5.6 CTRL_GUI0_CHECKBOX (Case a cocher)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_CHECKBOX">
    <Model ID="MODEL_GUI_INT" id="1">
      <Var FieldID="15"/>
    </Model>
    <X id="21" val="10"/>
    <Y id="22" val="100"/>
    <Width id="23" val="120"/>
    <Height id="24" val="18"/>
    <Data FieldID="15" id="43"/>
    <ControlName id="46" val="chkActif"/>
    <Format id="82" valUnicode="Actif"/>  <!-- Libelle -->
    <TabOrder id="314" val="5"/>
  </PropertyList>
</Control>
```

### 5.7 CTRL_GUI0_RADIO (Bouton radio)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_RADIO">
    <Model ID="MODEL_GUI_INT" id="1">
      <Var FieldID="20"/>
    </Model>
    <X id="21" val="10"/>
    <Y id="22" val="120"/>
    <Width id="23" val="200"/>
    <Height id="24" val="40"/>
    <Data FieldID="20" id="43"/>
    <ControlName id="46" val="rdType"/>
    <ChoiceColumns id="67" val="2"/>    <!-- Nb colonnes options -->
    <AllowParking id="315" val="Y"/>
  </PropertyList>
</Control>
```

### 5.8 CTRL_GUI0_LINE (Ligne)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_LINE">
    <X1 id="21" val="10"/>     <!-- Point depart X -->
    <Y1 id="22" val="50"/>     <!-- Point depart Y -->
    <X2 id="23" val="300"/>    <!-- Point arrivee X -->
    <Y2 id="24" val="50"/>     <!-- Point arrivee Y (meme = horizontal) -->
    <Color id="51" val="7"/>   <!-- Noir -->
    <Style id="63" val="3"/>   <!-- Style ligne -->
  </PropertyList>
</Control>
```

### 5.9 CTRL_GUI0_SUBFORM (Sous-formulaire)

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_SUBFORM">
    <X id="21" val="10"/>
    <Y id="22" val="150"/>
    <Width id="23" val="400"/>
    <Height id="24" val="200"/>
    <SubformTask comp="-1" obj="25"/>  <!-- Reference tache enfant -->
  </PropertyList>
</Control>
```

---

## 6. Evenements

### 6.1 Types d'evenements (EventType)

| Type | Nom | Description |
|------|-----|-------------|
| **S** | System | Evenement systeme (Record Main, Task Prefix, etc.) |
| **I** | Internal | Evenement interne Magic |
| **U** | User | Evenement utilisateur defini |
| **K** | Keyboard | Raccourci clavier |

### 6.2 InternalEventID courants

| ID | Nom | Description |
|----|-----|-------------|
| 14 | Exit | Fermer/Quitter |
| 34 | OK | Valider (equivalent Entree) |
| 42 | Custom | Evenement personnalise |
| 63 | Refresh | Rafraichir |
| 219 | Cancel/Abandon | Annuler |
| 220 | Continue/OK | Continuer/Confirmer |
| 393 | ? | A documenter |

### 6.3 RaiseEvent dans les controles

```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_PUSH_BUTTON">
    <Format id="82" valUnicode="Annuler"/>
    <RaiseEvent id="234">
      <EventType val="I"/>
      <InternalEventID val="219"/>    <!-- 219 = Annuler -->
      <PublicObject comp="-1"/>
    </RaiseEvent>
  </PropertyList>
</Control>
```

### 6.4 Gestion des evenements dans LogicUnit

```xml
<LogicUnit id="5">
  <Level val="R"/>
  <Type val="M"/>
  <Event>
    <EventType val="I"/>
    <InternalEventID val="42"/>       <!-- Ecoute evenement 42 -->
    <PublicObject comp="-1"/>
  </Event>
  <LogicLines>
    <!-- Actions a executer -->
  </LogicLines>
</LogicUnit>
```

---

## 7. Styles et couleurs

### 7.1 Codes couleur

| Code | Couleur |
|------|---------|
| 1 | Rouge |
| 2 | Vert |
| 3 | Bleu |
| 4 | Cyan |
| 5 | Magenta |
| 6 | Blanc |
| 7 | Noir |
| 8 | Jaune |

### 7.2 Codes Style

| Code | Style |
|------|-------|
| 1 | Standard/3D |
| 2 | Enfonce |
| 3 | Relief |
| 7 | Transparent |

### 7.3 HorizontalAlignment

| Code | Alignement |
|------|------------|
| 1 | Gauche |
| 2 | Centre |
| 3 | Droite |

---

## 8. Hierarchie des controles

Les controles peuvent etre imbriques via `ISN_FATHER`:

```xml
<!-- Parent: Table -->
<Control id="1">
  <PropertyList model="CTRL_GUI0_TABLE">
    ...
  </PropertyList>
</Control>

<!-- Enfant: Colonne de la table -->
<Control ISN_FATHER="1" id="2">
  <PropertyList model="CTRL_GUI0_COLUMN">
    ...
  </PropertyList>
</Control>

<!-- Enfant: Edit dans la colonne -->
<Control ISN_FATHER="1" id="3">
  <PropertyList model="CTRL_GUI0_EDIT">
    <ControlLayer id="25" val="1"/>    <!-- Associe a colonne 1 -->
    ...
  </PropertyList>
</Control>
```

---

## 9. Conversion TypeScript/React

### 9.1 Mapping des controles

| Magic Control | React Component |
|---------------|-----------------|
| CTRL_GUI0_STATIC | `<span>` / `<label>` |
| CTRL_GUI0_EDIT | `<input type="text">` |
| CTRL_GUI0_PUSH_BUTTON | `<button>` |
| CTRL_GUI0_TABLE | `<table>` / DataGrid |
| CTRL_GUI0_CHECKBOX | `<input type="checkbox">` |
| CTRL_GUI0_RADIO | `<input type="radio">` |
| CTRL_GUI0_COMBO | `<select>` |
| CTRL_GUI0_IMAGE | `<img>` |
| CTRL_GUI0_LINE | `<hr>` / CSS border |
| CTRL_GUI0_SUBFORM | `<Component>` |

### 9.2 Exemple de conversion

**Magic XML:**
```xml
<Control id="1">
  <PropertyList model="CTRL_GUI0_EDIT">
    <X id="21" val="100"/>
    <Y id="22" val="50"/>
    <Width id="23" val="200"/>
    <Height id="24" val="25"/>
    <Data FieldID="10" id="43"/>
    <ControlName id="46" val="txtNom"/>
    <TabOrder id="314" val="1"/>
  </PropertyList>
</Control>
```

**React TSX:**
```tsx
<input
  type="text"
  name="txtNom"
  value={formData.field10}
  onChange={(e) => handleChange('field10', e.target.value)}
  style={{
    position: 'absolute',
    left: 100,
    top: 50,
    width: 200,
    height: 25
  }}
  tabIndex={1}
/>
```

### 9.3 Gestion des evenements

**Magic XML:**
```xml
<RaiseEvent id="234">
  <EventType val="I"/>
  <InternalEventID val="220"/>
</RaiseEvent>
```

**React TSX:**
```tsx
const handleOkClick = () => {
  // InternalEventID 220 = OK/Continuer
  onSubmit(formData);
};

<button onClick={handleOkClick}>
  Valider
</button>
```

---

## 10. Logique de Workflow (Visible/Enabled)

### 10.1 Expressions de Visibilite et Activation

Les boutons et controles peuvent avoir des conditions dynamiques:

```xml
<Control id="27">
  <PropertyList model="CTRL_GUI0_PUSH_BUTTON">
    <ControlName id="46" val="OUV"/>
    <Visible Exp="10" id="61"/>      <!-- Expression 10 pour visibilite -->
    <Enabled Exp="6" id="62"/>        <!-- Expression 6 pour activation -->
    <Format id="82" valUnicode="&amp;Ouvrir la session"/>
  </PropertyList>
</Control>
```

### 10.2 Exemple reel: Gestion de la Caisse (Prg_121)

**Ecran CA0142 - Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  D S I O P (21)          Le coffre 2 est ferme     Tue 30 Dec 2025  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Image caisse]              ┌──────────────────┐      [Appro caisse]      │
│                              │     Fermee       │      [Appro produits]    │
│                              │  par  [user]     │      [Remise en caisse]  │
│                              │  le   [date]     │      [Historiques]       │
│                              │  à    [heure]    │                          │
│                              └──────────────────┘                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Régul. Télécollecte]   [Telecollecte TPE]                                │
│  [Visu sessions]   [Consultation]   [Pointage AppRem]                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Quitter]   [Ouvrir la session]   [Continuer la session]   [Fermer]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Expressions de controle:**
```xml
<!-- Expression 6: Bouton "Ouvrir" actif si session Fermee -->
<Expression id="6">
  <ExpSyntax val="{0,3}=MlsTrans('Fermee')"/>
</Expression>

<!-- Expression 7: Boutons "Continuer/Fermer" actifs si session Ouverte -->
<Expression id="7">
  <ExpSyntax val="{0,3}=MlsTrans('Ouverte')"/>
</Expression>

<!-- Expression 10: Visible si statut != 'B' (Bloque) -->
<Expression id="10">
  <ExpSyntax val="{1,2}&lt;>'B'"/>
</Expression>

<!-- Expression 12: Visible si session Ouverte (operations) -->
<Expression id="12">
  <ExpSyntax val="{1,2}='O'"/>
</Expression>

<!-- Expression 26: Message coffre dynamique -->
<Expression id="26">
  <ExpSyntax val="MlsTrans('Le coffre 2 est')&amp;' '&amp;IF({1,28},MlsTrans('ouvert'),MlsTrans('ferme'))"/>
</Expression>
```

### 10.3 Matrice Visibilite/Activation par Etat

| Bouton | Visible | Enabled | Condition |
|--------|---------|---------|-----------|
| Ouvrir la session | statut ≠ 'B' | statut = 'Fermee' | Exp 10, Exp 6 |
| Continuer la session | statut ≠ 'B' | statut = 'Ouverte' | Exp 10, Exp 7 |
| Fermer la session | statut ≠ 'B' | statut = 'Ouverte' | Exp 10, Exp 7 |
| Appro caisse | statut = 'O' | - | Exp 12 |
| Appro produits | statut = 'O' | - | Exp 12 |
| Remise en caisse | statut = 'O' | - | Exp 12 |
| Historiques | statut = 'O' | - | Exp 13 |
| Consultation | statut ≠ 'O' | - | Exp 11 |
| Visu sessions | toujours | - | - |
| Quitter | toujours | - | - |

---

## 11. Navigation et Flux d'Ecrans

### 11.1 RaiseEvent avec appel de tache

**Appel d'un programme externe (obj):**
```xml
<RaiseEvent id="234">
  <EventType val="U"/>              <!-- U = User event -->
  <PublicObject comp="-1" obj="2"/> <!-- Appel tache 2 du meme composant -->
</RaiseEvent>
```

**Appel d'un evenement interne:**
```xml
<RaiseEvent id="234">
  <EventType val="I"/>              <!-- I = Internal event -->
  <InternalEventID val="222"/>      <!-- Event ID specifique -->
  <PublicObject comp="-1"/>
</RaiseEvent>
```

### 11.2 InternalEventID complets (ADH)

| ID | Nom | Description |
|----|-----|-------------|
| 14 | Exit | Fermer fenetre |
| 28 | ExitApp | Quitter application |
| 34 | OK/Enter | Valider/Entree |
| 42 | Custom | Evenement personnalise |
| 63 | Refresh | Rafraichir |
| 219 | Cancel | Quitter/Annuler |
| 220 | Continue | Continuer |
| 221 | PrintTicket | Impression ticket |
| 222 | CloseSession | Fermeture session |
| 223 | ApproDepot | Appro caisse |
| 224 | ApproProduit | Appro produits |
| 225 | RemiseCaisse | Remise en caisse |
| 226 | Historiques | Afficher historique |
| 227 | Consultation | Mode consultation |
| 228 | VisuSessions | Liste sessions |

### 11.3 Workflow Caisse (Prg_121)

```
[Application Start]
       │
       ▼
┌─────────────────┐
│  Lecture Etat   │ ◄─── Verifier session existante
└────────┬────────┘
         │
    ┌────┴────┐
    │ Fermee? │
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
[Ouvrir actif]      [Continuer/Fermer actifs]
    │                     │
    ▼                     ▼
┌─────────┐         ┌────────────┐
│ Prg_122 │         │ Operations │
│ Ouverture│         │   caisse   │
└────┬────┘         └─────┬──────┘
     │                    │
     ▼                    ▼
[Session Ouverte] ◄────[Continuer]
     │
     ▼
[Fermer la session]
     │
     ▼
┌─────────┐
│ Prg_131 │
│Fermeture│
└─────────┘
```

---

## 12. Points a valider

- [x] Liste complete des InternalEventID avec signification
- [ ] Codes Font avec correspondance exacte
- [ ] Comportement exact de ControlLayer pour les tables
- [ ] Gestion des sous-formulaires (SUBFORM)

---

## 13. Conversion Forms vers HTML/CSS

### 13.1 Systeme d'Unites Magic

Magic utilise des **Dialog Units (DLU)** pour le positionnement et le dimensionnement.
Les proprietes visibles dans le panneau Magic sont:

| Panneau Magic | Description | Formule |
|---------------|-------------|---------|
| **Form units** | "Dialog units" - Unites de base | DLU |
| **Horizontal factor** | Facteur grille horizontal | 8 (typique) |
| **Vertical factor** | Facteur grille vertical | 8 (typique) |
| **Width (Navigation)** | Largeur en caracteres logiques | DLU / HorizontalFactor |
| **Height (Navigation)** | Hauteur en caracteres logiques | DLU / VerticalFactor |

### 13.2 Formule de Conversion DLU → Pixels

**Etape 1: Calcul Navigation (visible dans Magic)**
```
Navigation_Width = Width_DLU / HorizontalFactor
Navigation_Height = Height_DLU / VerticalFactor
```

**Etape 2: Conversion Pixels**
```
Pixel_Width ≈ Navigation_Width × 4
Pixel_Height ≈ Navigation_Height × 8

Formule directe:
Pixel_Width ≈ Width_DLU × 0.5
Pixel_Height ≈ Height_DLU × 1.0
```

**Exemple CA0142 (Gestion de la caisse):**
```
XML: Width="939" Height="178" HorizontalFactor="8"

Navigation: 939/8 = 117.375 × 22.25

Formule calibrée (validée visuellement):
  Scale X = 0.53 (ajusté après comparaison runtime)
  Scale Y = 1.0

Pixels: 939 × 0.53 ≈ 498px width
        178 × 1.0 = 178px height (contenu)
```

### 13.3 Facteurs de Conversion par Element

| Type | Scale X | Scale Y | Notes |
|------|---------|---------|-------|
| Fenetre (Width/Height) | ×0.53 | ×1.0 | DLU → pixels (calibré) |
| Controles (X/Y) | ×0.53 | ×1.0 | Position |
| Texte (Width) | ×0.53 | - | Largeur champs |
| Hauteur boutons | - | ×1.0 | Conserver DLU |

> **Note:** Le facteur 0.53 a été calibré par comparaison visuelle avec le runtime Magic.
> Le facteur théorique (0.5) donne des résultats légèrement trop petits.

### 13.4 CSS Variables Recommandees

```css
:root {
    /* Facteur de conversion horizontal: DLU × 0.5 → pixels */
    --scale-x: 0.5;
    /* Facteur vertical: 1:1 avec DLU */
    --scale-y: 1.0;
    /* Dimensions calculees pour CA0142 */
    --form-width: 470px;   /* 939 × 0.5 */
    --form-height: 178px;  /* 178 × 1.0 */
}

.magic-window {
    width: var(--form-width);
}

.control {
    position: absolute;
    left: calc(var(--x-dlu) * var(--scale-x) * 1px);
    top: calc(var(--y-dlu) * var(--scale-y) * 1px);
    width: calc(var(--w-dlu) * var(--scale-x) * 1px);
    height: calc(var(--h-dlu) * var(--scale-y) * 1px);
}
```

### 13.3 Exemple Complet - Prg_121

**XML Source (Prg_121.xml):**
```xml
<FormEntry id="2">
  <PropertyList model="FORM_GUI0">
    <X id="21" val="98"/>
    <Y id="22" val="44"/>
    <Width id="23" val="939"/>
    <Height id="24" val="178"/>
    <HorizontalFactor id="35" val="8"/>
  </PropertyList>

  <!-- Bouton Quitter: X=7, Y=154, W=200, H=18 -->
  <Control id="26">
    <PropertyList model="CTRL_GUI0_PUSH_BUTTON">
      <X id="21" val="7"/>
      <Y id="22" val="154"/>
      <Width id="23" val="200"/>
      <Height id="24" val="18"/>
      <Format id="82" valUnicode="&amp;Quitter"/>
      <RaiseEvent id="234">
        <InternalEventID val="219"/>
      </RaiseEvent>
    </PropertyList>
  </Control>
</FormEntry>
```

**HTML/CSS Converti:**
```html
<style>
    :root {
        --scale-x: 0.506;  /* 939 → 475px */
    }

    #btnQuitter {
        left: calc(7 * var(--scale-x));      /* 3.5px */
        top: 154px;
        width: calc(200 * var(--scale-x));   /* 101px */
        height: 18px;
    }
</style>

<button id="btnQuitter" onclick="handleEvent(219)">Quitter</button>
```

### 13.4 Mapping Controles → HTML

| Control Magic | Element HTML | Styles Speciaux |
|---------------|--------------|-----------------|
| CTRL_GUI0_STATIC | `<div>` / `<span>` | - |
| CTRL_GUI0_EDIT | `<input type="text">` / `<div>` readonly | - |
| CTRL_GUI0_PUSH_BUTTON | `<button>` | border, background gradient |
| CTRL_GUI0_IMAGE | `<div>` avec background-image | object-fit: contain |
| CTRL_GUI0_CHECKBOX | `<input type="checkbox">` | - |
| CTRL_GUI0_COMBO | `<select>` | - |
| CTRL_GUI0_TABLE | `<table>` / grid layout | - |

### 13.5 Attributs → CSS

| Attribut Magic | Propriete CSS |
|----------------|---------------|
| X | left |
| Y | top |
| Width | width |
| Height | height |
| Visible | display (none/block) |
| Enabled | disabled attribute / opacity |
| Color | color / background-color |
| Font | font-family, font-size |
| HorizontalAlignment | text-align |

### 13.6 Gestion des Images

Magic utilise des chemins logiques dans `magic.ini`:

```ini
[LOGICAL_NAMES]
club_images = C:\DATA\CLUBMED\PMS\DATAFIX\Images\
```

**Resolution:**
```
%club_images%caisse5.bmp → C:\DATA\CLUBMED\PMS\DATAFIX\Images\caisse5.bmp
```

**HTML:**
```html
<div class="caisse-image">
    <img src="/images/caisse5.bmp" alt="Caisse" />
</div>
```

### 13.7 Logique Visible/Enabled en JavaScript

```javascript
function updateUI() {
    const sessionOuverte = sessionState.status === 'O';
    const sessionFermee = sessionState.status === 'F';

    // Visible Exp 10: statut ≠ 'B' (Bloque)
    const notBlocked = sessionState.status !== 'B';

    // Enabled Exp 6: session fermee
    document.getElementById('btnOuvrir').disabled = !sessionFermee;

    // Enabled Exp 7: session ouverte
    document.getElementById('btnContinuer').disabled = !sessionOuverte;
    document.getElementById('btnFermer').disabled = !sessionOuverte;

    // Visible Exp 12: operations visibles si session ouverte
    const opButtons = ['btnApproCaisse', 'btnApproProduits', 'btnRemiseCaisse'];
    opButtons.forEach(id => {
        document.getElementById(id).classList.toggle('hidden', !sessionOuverte);
    });
}
```

---

## 14. Configuration Runtime (magic.ini)

### 14.1 Parametres Contexte

Le fichier `magic.ini` contient le contexte invisible a l'utilisateur:

```ini
[MAGIC_ENV]
club_user = DSIOP      ; Utilisateur connecte
term = 0               ; Terminal
RunMode = R            ; Mode: R=Runtime, D=Dev
Langue = E             ; Langue: E=Espagnol, F=Francais

[DATABASES]
Pms = DBMS, 21, LRO0912, , localhost\sqlexpress, , pms, l1mas345*
```

### 14.2 Utilisation dans l'Interface

```javascript
const CONTEXT = {
    societe: 'C',
    utilisateur: 'DSIOP',  // Depuis magic.ini
    terminal: 0,           // Depuis magic.ini
    runMode: 'R',          // Depuis magic.ini
    langue: 'E'            // Depuis magic.ini
};
```

---

*Document mis a jour par Claude Code - 2025-12-30*
*Source: Analyse des fichiers ADH avec formulaires GUI (Prg_121)*
