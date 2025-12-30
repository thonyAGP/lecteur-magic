# Specification XML Magic Unipaas v12.03

## Vue d'Ensemble

Tous les fichiers XML Magic Unipaas suivent une structure commune avec un Header contenant la version et des parametres globaux.

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<Application>
  <Header>
    <Version val="12030"/>           <!-- Version Magic 12.0.30 -->
    <WithIsn val="Y"/>               <!-- Avec ISN (Internal Serial Number) -->
    <!-- Elements specifiques selon le type de fichier -->
  </Header>

  <!-- Contenu specifique selon le type -->
</Application>
```

---

## 1. Structure des Programmes (Prg_XXX.xml)

### 1.1 Element Racine : Task

```xml
<Task MainProgram="Y">
  <!-- MainProgram="Y" : Programme principal -->
  <!-- MainProgram="N" : Sous-tache ou programme secondaire -->
</Task>
```

### 1.2 Header du Programme

```xml
<Header Description="Nom du programme" ISN_2="1" LastIsn="2" id="123">
  <Public val="nom_public"/>           <!-- Nom public/alias du programme -->
  <ExecutionRight comp="-1"/>          <!-- Droits d'execution -->
  <Resident val="N"/>                  <!-- Y=Resident en memoire, N=Non -->
  <SQL val="N"/>                       <!-- Y=Utilise SQL direct -->

  <ReturnValue>
    <ReturnValueAttr/>
    <TSK_PARAMS val="3"/>              <!-- Nombre de parametres -->
    <ParametersCount val="3"/>
    <ParametersAttributes>
      <Attr MgAttr="D"/>               <!-- D=Date, A=Alpha, N=Numeric, U=Unicode, B=Boolean -->
      <Attr MgAttr="D"/>
      <Attr MgAttr="B"/>
    </ParametersAttributes>
  </ReturnValue>

  <SqlWhereExist val="N"/>
  <TaskType val="B"/>                  <!-- B=Batch/Browse, O=Online/Output, I=Internal -->
  <External val="N"/>                  <!-- Programme externe -->
  <Closeopentasks val="N"/>
  <RunProjectAs val="O"/>              <!-- O=Original, autre mode d'execution -->
  <FormType val="N"/>                  <!-- Type de formulaire -->
  <DotNetObjectExists val="N"/>        <!-- Objets .NET presents -->

  <LastModified
    _date="739546"
    _time="40841"
    date="22/10/2025"
    time="11:20:41"/>
</Header>
```

**Attributs MgAttr (Types de parametres) :**
| Code | Type | Description |
|------|------|-------------|
| `A` | Alpha | Chaine ANSI |
| `U` | Unicode | Chaine Unicode |
| `N` | Numeric | Nombre |
| `D` | Date | Date |
| `T` | Time | Heure |
| `B` | Boolean | Logique Y/N |
| `L` | Blob | Donnees binaires |

### 1.3 Resource (Acces aux Donnees)

```xml
<Resource>
  <!-- Acces aux bases de donnees -->
  <DB>
    <DataObject comp="-1" obj="40"/>   <!-- obj = ID de la table dans DataSources -->
    <Access val="R"/>                  <!-- R=Read, W=Write -->
    <Share val="W"/>                   <!-- Mode de partage -->
    <Open val="N"/>                    <!-- Ouverture explicite -->
    <Cache val="N"/>                   <!-- Mise en cache -->
    <IdentifyRowModifications val="84"/>
  </DB>

  <!-- Definition des colonnes/variables -->
  <Columns>
    <Column id="1" name="VG.LOGIN">
      <PropertyList model="FIELD">
        <Model attr_obj="FIELD_UNICODE" id="1"/>
        <Picture id="157" valUnicode="U8"/>      <!-- Format d'affichage -->
        <Size id="174" val="16"/>                 <!-- Taille en bytes -->
        <StoredAs id="173" val="31"/>             <!-- Type de stockage -->
        <_FieldStyle id="276" val="1"/>           <!-- Style du champ -->
      </PropertyList>
    </Column>

    <Column id="2" name="P.date_debut">
      <PropertyList model="FIELD">
        <Model attr_obj="FIELD_DATE" id="1"/>
        <Picture id="157" valUnicode="DD/MM/YYYY"/>
        <DefaultValue id="170" val="0"/>
      </PropertyList>
    </Column>
  </Columns>

  <ColumnsLastIsn val="41"/>
</Resource>
```

**Types de champs (attr_obj) :**
| Type | Description |
|------|-------------|
| `FIELD_ALPHA` | Chaine ANSI |
| `FIELD_UNICODE` | Chaine Unicode |
| `FIELD_NUMERIC` | Nombre decimal |
| `FIELD_LOGICAL` | Booleen |
| `FIELD_DATE` | Date |
| `FIELD_TIME` | Heure |
| `FIELD_BLOB` | Donnees binaires |

**Codes de stockage (StoredAs) :**
| Code | Type SQL |
|------|----------|
| 1 | varchar |
| 19 | date (char(8)) |
| 22 | numeric |
| 23 | time |
| 31 | unicode/nvarchar |

### 1.4 Information (Configuration de la Tache)

```xml
<Information>
  <Key>
    <Column val="1"/>                  <!-- Colonne cle primaire -->
    <Mode val="N"/>
  </Key>

  <DB comp="-1" obj="31"/>             <!-- Table principale -->

  <Sort>
    <CLS val="A"/>                     <!-- A=Ascending, D=Descending -->
  </Sort>

  <ForceRecordDelete DEL="N"/>
  <EndTaskCondition val="N"/>
  <EvaluateEndCondition val="B"/>      <!-- B=Before, A=After -->
  <InitialMode val="E"/>               <!-- E=Edit, M=Modify, Q=Query -->

  <Locate Direction="A"/>
  <Range Direction="A"/>
  <VarRange/>

  <TaskProperties>
    <SelectionTable val="N"/>
    <ConfirmUpdate CNFU="N"/>
    <ConfirmCancel val="N"/>
    <ErrorStrategy val="R"/>           <!-- R=Rollback, A=Abort, I=Ignore -->
    <LockingStrategy val="O"/>         <!-- O=Optimistic, I=Immediate, N=None -->
    <CacheStrategy val="P"/>           <!-- P=Position, S=Session -->
    <ForceRecordSuffix val="N"/>
    <TransactionMode val="P"/>         <!-- P=Per record, D=Deferred -->
    <TransactionBegin val="L"/>        <!-- L=Lazy, I=Immediate -->
    <PreloadView val="N"/>
    <AllowEmptyDataview val="Y"/>
    <KeepCreatedContext val="N"/>
  </TaskProperties>

  <!-- Permissions utilisateur (interface) -->
  <SIDE_WIN>
    <AllowOptions val="Y"/>
    <AllowQuery val="Y"/>
    <AllowModify val="Y"/>
    <AllowCreate val="Y"/>
    <AllowDelete val="Y"/>
    <AllowLocate val="Y"/>
    <AllowRange val="Y"/>
    <AllowIndexChange val="Y"/>
    <AllowSorting val="Y"/>
    <AllowIOFiles val="Y"/>
    <RecordCycle val="Y"/>
    <AllowEvents val="Y"/>
    <AllowIndexOptimization val="Y"/>
    <AllowLocationInQuery val="Y"/>
    <AllowPrintingData val="N"/>
  </SIDE_WIN>

  <!-- Proprietes fenetre -->
  <WIN>
    <OpenTaskWindow val="Y"/>
    <CloseTaskWindow val="Y"/>
    <ForegroundWindow val="Y"/>
    <FlipFld val="N"/>
    <RefreshTaskWindow ReturnValue="N"/>
  </WIN>

  <BOX>
    <Direction val="V"/>               <!-- V=Vertical, H=Horizontal -->
  </BOX>
</Information>
```

### 1.5 TaskLogic (Logique Metier)

```xml
<TaskLogic>
  <LogicUnit id="2" propagate="78">
    <Level val="R"/>                   <!-- R=Record, T=Task, H=Handler -->
    <Type val="M"/>                    <!-- M=Main, S=Select, P=Process -->
    <_DspTemplate val="0"/>
    <_HeaderPosition val="1"/>
    <Scope val="S"/>                   <!-- S=Single, G=Global -->
    <EngineDirective val="S"/>
    <ShowMessage val="Y"/>
    <Condition val="89"/>              <!-- Reference a une expression -->
    <_TotalVariabls val="15"/>

    <Event>
      <EventType val="S"/>             <!-- S=Start, F=Finish, R=Record, U=User -->
      <PublicObject comp="-1"/>
    </Event>

    <Expanded val="1"/>

    <LogicLines>
      <!-- Actions de logique -->
    </LogicLines>
  </LogicUnit>
</TaskLogic>
```

---

## 2. Actions de Logique (LogicLines)

### 2.1 DATAVIEW_SRC (Source de Vue)

```xml
<LogicLine>
  <DATAVIEW_SRC FlowIsn="2" IDX="1" Type="M">
    <Condition val="N"/>
    <Modifier val="B"/>                <!-- B=Both, S=Source, D=Destination -->
    <Direction val="C"/>               <!-- C=Current, N=Next, P=Previous -->
  </DATAVIEW_SRC>
</LogicLine>
```

### 2.2 Select (Selection de Donnees)

```xml
<LogicLine>
  <Select FieldID="1" FlowIsn="3" id="1">
    <Column val="1"/>                  <!-- Colonne source -->
    <Type val="V"/>                    <!-- V=Variable, R=Record, E=Expression -->
    <IsParameter val="Y"/>             <!-- Est un parametre d'entree -->
    <_RecomputeIndex val="1"/>
    <_FormIndex val="1"/>
    <_ControlIndex val="1"/>
    <DIFF_UPDATE val="T"/>
    <Condition val="Y"/>               <!-- Condition d'application -->
    <Modifier val="B"/>
    <Direction val="C"/>
  </Select>
</LogicLine>
```

### 2.3 CallTask (Appel de Tache/Programme)

```xml
<LogicLine>
  <CallTask FlowIsn="4">
    <OperationType val="T"/>           <!-- T=Task, P=Process/Program -->
    <TaskID comp="-1" obj="2"/>        <!-- obj = ID du programme appele -->
    <Lock val="N"/>                    <!-- Verrouillage -->
    <Wait val="Y"/>                    <!-- Attendre la fin de l'execution -->
    <SyncData val="N"/>                <!-- Synchroniser les donnees -->
    <RetainFocus val="N"/>             <!-- Conserver le focus -->

    <Arguments>
      <Argument>
        <id val="175"/>                <!-- ID du parametre -->
        <Expression val="59"/>         <!-- Reference a une expression -->
        <Skip val="N"/>                <!-- Sauter ce parametre -->
      </Argument>
      <Argument>
        <id val="199"/>
        <Variable val="86"/>           <!-- Reference a une variable -->
        <Skip val="Y"/>
      </Argument>
    </Arguments>

    <Condition val="Y"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </CallTask>
</LogicLine>
```

### 2.4 Update (Mise a Jour)

```xml
<LogicLine>
  <Update FlowIsn="15">
    <FieldID val="1"/>                 <!-- Champ a mettre a jour -->
    <WithValue val="1"/>               <!-- Valeur ou reference expression -->
    <Incremental val="N"/>             <!-- Mise a jour incrementale -->
    <ForcedUpdate val="Y"/>            <!-- Forcer la mise a jour -->
    <Condition val="Y"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </Update>
</LogicLine>
```

### 2.5 RaiseEvent (Lever un Evenement)

```xml
<LogicLine>
  <RaiseEvent FlowIsn="460">
    <Event>
      <EventType val="U"/>             <!-- U=User event -->
      <PublicObject comp="-1" obj="2"/>
    </Event>

    <Wait val="89"/>                   <!-- Attendre (ref expression ou booleen) -->

    <Arguments>
      <Argument>
        <id val="175"/>
        <Expression val="59"/>
        <Skip val="N"/>
      </Argument>
    </Arguments>

    <Condition val="Y"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </RaiseEvent>
</LogicLine>
```

### 2.6 Remark (Commentaire)

```xml
<LogicLine>
  <Remark FlowIsn="6">
    <Type val="2"/>
    <Text val="Ceci est un commentaire"/>
  </Remark>
</LogicLine>
```

---

## 3. DataSources.xml (Definition des Tables)

```xml
<DataSourceRepository>
  <DataObjects>
    <DataObject
      PhysicalName="histoticket_dat"
      Public="histoticket_dat01"
      Resident="N"
      data_source="Pooling"
      id="1"
      name="histoticket_dat">

      <Encrypt val="N"/>
      <Cache val="N"/>
      <IdentifyRowModifications val="P"/>
      <HasHint val="Y"/>
      <Cursor val="D"/>
      <ObjectType val="T"/>            <!-- T=Table, V=View, Q=Query -->
      <RowLength val="4042"/>
      <ColumnsLastIsn val="19"/>
      <IndexesLastIsn val="2"/>

      <Columns>
        <Column id="1" name="pbx_traite_status">
          <PropertyList model="FIELD">
            <Model attr_obj="FIELD_UNICODE" id="1"/>
            <Picture id="157" valUnicode="U"/>
            <NullValue id="167"/>
            <StoredAs id="173" val="31"/>
            <Size id="174" val="2"/>
            <Definition id="175" val="2"/>
            <DbColumnName id="178" val="pbx_traite_status"/>
            <_FieldPhysical
              Name="pbx_traite_status"
              PIC_U="U"
              Size="4"
              allowed_null="N"
              attribute="U"
              database_definition="2"
              storage="31"
              translate="3"/>
            <DefaultStorage id="274" val="Y"/>
          </PropertyList>
        </Column>

        <Column id="2" name="pbx_traite_date">
          <PropertyList model="FIELD">
            <Model attr_obj="FIELD_DATE" id="1"/>
            <Picture id="157" valUnicode="DD/MM/YYYY"/>
            <DefaultValue id="170" val="0"/>
            <StoredAs id="173" val="19"/>
            <Size id="174" val="8"/>
            <DbColumnName id="178" val="pbx_traite_date"/>
            <Type id="179" val="char(8)"/>
          </PropertyList>
        </Column>
      </Columns>

      <Indexes>
        <Index id="1" name="PK_histoticket">
          <Unique val="Y"/>
          <Columns>
            <IndexColumn id="1" dir="A"/>
          </Columns>
        </Index>
      </Indexes>
    </DataObject>
  </DataObjects>
</DataSourceRepository>
```

**Attributs DataObject :**
| Attribut | Description |
|----------|-------------|
| `PhysicalName` | Nom physique dans la base |
| `Public` | Nom public/alias |
| `id` | Identifiant unique |
| `name` | Nom logique |
| `data_source` | Source de connexion (Pooling, Pms, etc.) |
| `ObjectType` | T=Table, V=View, Q=Query |

---

## 4. Progs.xml (Arborescence)

```xml
<Header>
  <Version val="12030"/>
  <WithIsn val="Y"/>
  <Exe comp="-1"/>
  <LastIsn val="973"/>
  <LastIsnFolder val="47"/>

  <Folders>
    <Folder id="1">
      <Name val="Bar"/>
      <StartsAt val="613"/>            <!-- Position de debut dans ProgramsRepositoryOutLine -->
      <NumberOfEntries val="2"/>       <!-- Nombre de programmes dans ce dossier -->
    </Folder>
    <Folder id="2">
      <Name val="Biking"/>
      <StartsAt val="615"/>
      <NumberOfEntries val="1"/>
    </Folder>
  </Folders>
</Header>

<ProgramsRepositoryOutLine>
  <Programs>
    <Program id="1"/>    <!-- Position 1 -->
    <Program id="2"/>    <!-- Position 2 -->
    <!-- ... -->
    <Program id="XXX"/>  <!-- Position 613 = debut du dossier "Bar" -->
    <Program id="YYY"/>  <!-- Position 614 = encore dans "Bar" -->
    <Program id="ZZZ"/>  <!-- Position 615 = debut du dossier "Biking" -->
  </Programs>
</ProgramsRepositoryOutLine>
```

---

## 5. Comps.xml (Composants)

```xml
<ComponentsRepository>
  <Components>
    <!-- Composant Magic -->
    <Component id="1" name="UserFunctionality">
      <Description val="Handles Range, Locate, Sort and Print Data..."/>
      <MciFile val="UserFunctionality.eci"/>
      <ComponentType val="Magic xpa"/>
      <Type val="U"/>
      <CABINET_FILE val="%EngineDir%Add_On\UserFunctionality\UserFunctionality.ecf"/>
      <LoadImmediate val="Y"/>
      <CtlIndex val="1"/>
    </Component>

    <!-- Composant .NET -->
    <Component id="3" name="System.Windows.Forms">
      <Description val="System.Windows.Forms"/>
      <ComponentType val=".NET"/>
      <Type val="D"/>
      <LoadImmediate val="Y"/>
      <CtlIndex val="-1"/>
      <AssemblyName val="System.Windows.Forms, Version=4.0.0.0..."/>
      <AssemblyPath val="C:\windows\Microsoft.Net\assembly\GAC_MSIL\..."/>
      <UseSpecificVersion val="N"/>
      <isGuiThreadExecution val="Y"/>
    </Component>

    <!-- Composant partage (REF) -->
    <Component id="2" name="REF">
      <Description val="Composant de reference"/>
      <ComponentType val="Magic xpa"/>
      <Type val="C"/>
      <CABINET_FILE val="..\REF\REF.ecf"/>
      <LoadImmediate val="Y"/>
    </Component>
  </Components>
</ComponentsRepository>
```

---

## 6. Menus.xml

```xml
<MenusRepository>
  <Menus>
    <Menu>
      <MenuType val="4"/>
      <ToolNumber val="2"/>
      <Name val="Default Pulldown menu"/>
      <LastIsn val="7"/>

      <MenuEntry id="1">
        <MenuType val="1"/>            <!-- 1=Submenu -->
        <Description_U val="&amp;File"/>
        <Right comp="-1"/>
        <Help comp="-1"/>
        <Prompt comp="-1"/>

        <Menu>
          <MenuType val="1"/>
          <LastIsn val="7"/>

          <MenuEntry id="1">
            <MenuType val="3"/>        <!-- 3=Command -->
            <Flags val="1088"/>
            <Description_U val="&amp;Open Application"/>
            <Program comp="-1" obj="21"/>  <!-- obj = ID programme -->
            <SourceContext val="77"/>

            <Event>
              <EventType val="I"/>     <!-- I=Internal event -->
              <InternalEventID val="23"/>
            </Event>
          </MenuEntry>
        </Menu>
      </MenuEntry>
    </Menu>
  </Menus>
</MenusRepository>
```

**Types de MenuEntry :**
| Code | Description |
|------|-------------|
| 1 | Sous-menu |
| 2 | Appel programme |
| 3 | Commande |
| 5 | Separateur |

---

## 7. Models.xml (Modeles UI)

```xml
<ModelsRepository>
  <Models>
    <Object id="1" name="Grille">
      <PropertyList model="CTRL_GUI0_TABLE">
        <Color id="51" val="110"/>
        <LineDivider id="78" val="Y"/>
        <ColumnDivider id="189" val="Y"/>
        <SetTableColorBy id="428" val="2"/>
      </PropertyList>
    </Object>

    <Object id="2" name="Application Excel .net">
      <PropertyList model="FIELD">
        <Model attr_obj="FIELD_BLOB" id="1"/>
        <Size id="174" val="28"/>
        <_FieldStyle id="276" val="5"/>
        <ObjectType id="478" val="Microsoft.Office.Interop.Excel._Application"/>
      </PropertyList>
    </Object>
  </Models>
</ModelsRepository>
```
