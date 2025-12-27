using Caisse.Application.Sessions.Commands;
using FluentValidation.TestHelper;

namespace Caisse.Application.Tests.Validators;

public class OuvrirSessionCommandValidatorTests
{
    private readonly OuvrirSessionCommandValidator _validator = new();

    [Fact]
    public void Should_Pass_When_Valid()
    {
        var command = new OuvrirSessionCommand("LISE", "431", "20251227");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Should_Fail_When_Utilisateur_Empty(string? utilisateur)
    {
        var command = new OuvrirSessionCommand(utilisateur!, "431", "20251227");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Utilisateur);
    }

    [Fact]
    public void Should_Fail_When_Utilisateur_TooLong()
    {
        var command = new OuvrirSessionCommand("UTILISATEUR_TROP_LONG", "431", "20251227");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Utilisateur);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Should_Fail_When_Terminal_Empty(string? terminal)
    {
        var command = new OuvrirSessionCommand("LISE", terminal!, "20251227");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Terminal);
    }

    [Theory]
    [InlineData("")]
    [InlineData("2025")]
    [InlineData("202512271")]
    public void Should_Fail_When_DateComptable_InvalidFormat(string dateComptable)
    {
        var command = new OuvrirSessionCommand("LISE", "431", dateComptable);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DateComptable);
    }

    [Fact]
    public void Should_Fail_When_DateComptable_NotNumeric()
    {
        var command = new OuvrirSessionCommand("LISE", "431", "ABCDEFGH");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.DateComptable);
    }
}
