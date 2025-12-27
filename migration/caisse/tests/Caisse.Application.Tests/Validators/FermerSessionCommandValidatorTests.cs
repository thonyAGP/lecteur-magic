using Caisse.Application.Sessions.Commands;
using FluentValidation.TestHelper;

namespace Caisse.Application.Tests.Validators;

public class FermerSessionCommandValidatorTests
{
    private readonly FermerSessionCommandValidator _validator = new();

    [Fact]
    public void Should_Pass_When_Valid()
    {
        var command = new FermerSessionCommand("LISE", 55);
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Should_Fail_When_Utilisateur_Empty(string? utilisateur)
    {
        var command = new FermerSessionCommand(utilisateur!, 55);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Utilisateur);
    }

    [Fact]
    public void Should_Fail_When_Utilisateur_TooLong()
    {
        var command = new FermerSessionCommand("UTILISATEUR_TROP_LONG", 55);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Utilisateur);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Should_Fail_When_ChronoSession_Invalid(double chrono)
    {
        var command = new FermerSessionCommand("LISE", chrono);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.ChronoSession);
    }
}
