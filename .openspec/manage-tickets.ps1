# OpenSpec Ticket Manager
# Permet d'archiver/desarchiver les tickets

param(
    [string]$Action,      # archive, unarchive, list
    [string]$TicketId
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $scriptDir "index.json"

# Load index
if (-not (Test-Path $indexPath)) {
    Write-Host "Erreur: index.json non trouve" -ForegroundColor Red
    exit 1
}

$index = Get-Content $indexPath -Raw | ConvertFrom-Json

function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "  =============================================" -ForegroundColor Cyan
    Write-Host "   OpenSpec - Gestion des Tickets" -ForegroundColor Cyan
    Write-Host "  =============================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "  TICKETS EN COURS ($($index.tickets.active.Count))" -ForegroundColor Green
    Write-Host "  -------------------------------------------"
    $i = 1
    foreach ($t in $index.tickets.active) {
        $status = $t.status.ToUpper().PadRight(8)
        Write-Host "    [$i] $($t.id.PadRight(15)) [$status] $($t.title)" -ForegroundColor White
        $i++
    }
    if ($index.tickets.active.Count -eq 0) {
        Write-Host "    (aucun)" -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "  ARCHIVES ($($index.tickets.archived.Count))" -ForegroundColor Yellow
    Write-Host "  -------------------------------------------"
    $j = 1
    foreach ($t in $index.tickets.archived) {
        $status = $t.status.ToUpper().PadRight(8)
        $date = if ($t.resolvedDate) { $t.resolvedDate } else { "?" }
        Write-Host "    [$j] $($t.id.PadRight(15)) [$status] $($t.title) ($date)" -ForegroundColor DarkGray
        $j++
    }
    if ($index.tickets.archived.Count -eq 0) {
        Write-Host "    (aucun)" -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "  -------------------------------------------"
    Write-Host "  [A] Archiver un ticket" -ForegroundColor Cyan
    Write-Host "  [U] Desarchiver un ticket" -ForegroundColor Cyan
    Write-Host "  [S] Changer le statut d'un ticket" -ForegroundColor Cyan
    Write-Host "  [Q] Quitter" -ForegroundColor Cyan
    Write-Host ""
}

function Archive-Ticket {
    Write-Host ""
    $id = Read-Host "  ID du ticket a archiver"

    $ticket = $index.tickets.active | Where-Object { $_.id -eq $id }
    if (-not $ticket) {
        Write-Host "  Ticket non trouve dans les actifs" -ForegroundColor Red
        Read-Host "  Appuyez sur Entree"
        return
    }

    # Add resolved date
    $ticket | Add-Member -NotePropertyName "resolvedDate" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd") -Force

    # Move to archived
    $index.tickets.active = @($index.tickets.active | Where-Object { $_.id -ne $id })
    $index.tickets.archived = @($index.tickets.archived) + $ticket

    Save-Index
    Write-Host "  Ticket $id archive !" -ForegroundColor Green
    Read-Host "  Appuyez sur Entree"
}

function Unarchive-Ticket {
    Write-Host ""
    $id = Read-Host "  ID du ticket a desarchiver"

    $ticket = $index.tickets.archived | Where-Object { $_.id -eq $id }
    if (-not $ticket) {
        Write-Host "  Ticket non trouve dans les archives" -ForegroundColor Red
        Read-Host "  Appuyez sur Entree"
        return
    }

    # Remove resolved date
    $ticketHash = @{
        id = $ticket.id
        title = $ticket.title
        status = "progress"
        file = $ticket.file
    }

    # Move to active
    $index.tickets.archived = @($index.tickets.archived | Where-Object { $_.id -ne $id })
    $index.tickets.active = @($index.tickets.active) + [PSCustomObject]$ticketHash

    Save-Index
    Write-Host "  Ticket $id desarchive (statut: progress) !" -ForegroundColor Green
    Read-Host "  Appuyez sur Entree"
}

function Change-Status {
    Write-Host ""
    $id = Read-Host "  ID du ticket"

    # Find in active or archived
    $ticket = $index.tickets.active | Where-Object { $_.id -eq $id }
    $isActive = $true
    if (-not $ticket) {
        $ticket = $index.tickets.archived | Where-Object { $_.id -eq $id }
        $isActive = $false
    }

    if (-not $ticket) {
        Write-Host "  Ticket non trouve" -ForegroundColor Red
        Read-Host "  Appuyez sur Entree"
        return
    }

    Write-Host ""
    Write-Host "  Statuts disponibles:" -ForegroundColor Cyan
    Write-Host "    [1] progress  - En cours d'analyse"
    Write-Host "    [2] spec      - Specification en cours"
    Write-Host "    [3] dev       - En developpement"
    Write-Host "    [4] resolved  - Resolu"
    Write-Host "    [5] rejected  - Rejete/KO"
    Write-Host ""

    $choice = Read-Host "  Nouveau statut (1-5)"

    $statuses = @{
        "1" = "progress"
        "2" = "spec"
        "3" = "dev"
        "4" = "resolved"
        "5" = "rejected"
    }

    if ($statuses.ContainsKey($choice)) {
        $ticket.status = $statuses[$choice]
        Save-Index
        Write-Host "  Statut mis a jour: $($statuses[$choice])" -ForegroundColor Green
    } else {
        Write-Host "  Choix invalide" -ForegroundColor Red
    }

    Read-Host "  Appuyez sur Entree"
}

function Save-Index {
    $index.lastUpdated = (Get-Date).ToString("o")
    $index | ConvertTo-Json -Depth 10 | Set-Content $indexPath -Encoding UTF8
}

# Main loop
if ($Action) {
    # Non-interactive mode
    switch ($Action.ToLower()) {
        "archive" {
            if (-not $TicketId) { Write-Host "TicketId requis"; exit 1 }
            $ticket = $index.tickets.active | Where-Object { $_.id -eq $TicketId }
            if ($ticket) {
                $ticket | Add-Member -NotePropertyName "resolvedDate" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd") -Force
                $index.tickets.active = @($index.tickets.active | Where-Object { $_.id -ne $TicketId })
                $index.tickets.archived = @($index.tickets.archived) + $ticket
                Save-Index
                Write-Host "Archived: $TicketId"
            }
        }
        "unarchive" {
            if (-not $TicketId) { Write-Host "TicketId requis"; exit 1 }
            $ticket = $index.tickets.archived | Where-Object { $_.id -eq $TicketId }
            if ($ticket) {
                $ticketHash = @{ id = $ticket.id; title = $ticket.title; status = "progress"; file = $ticket.file }
                $index.tickets.archived = @($index.tickets.archived | Where-Object { $_.id -ne $TicketId })
                $index.tickets.active = @($index.tickets.active) + [PSCustomObject]$ticketHash
                Save-Index
                Write-Host "Unarchived: $TicketId"
            }
        }
        "list" {
            Write-Host "Active: $($index.tickets.active.id -join ', ')"
            Write-Host "Archived: $($index.tickets.archived.id -join ', ')"
        }
    }
} else {
    # Interactive mode
    do {
        Show-Menu
        $choice = Read-Host "  Choix"

        switch ($choice.ToUpper()) {
            "A" { Archive-Ticket }
            "U" { Unarchive-Ticket }
            "S" { Change-Status }
            "Q" { break }
        }
    } while ($choice.ToUpper() -ne "Q")
}

Write-Host ""
