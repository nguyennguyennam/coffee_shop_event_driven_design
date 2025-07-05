using Microsoft.AspNetCore.Mvc;
using DTO.DrinkDTO;
using service.usecase;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrinksController : ControllerBase
    {
        private readonly IDrinkUseCase _drinkUseCase;

        public DrinksController(IDrinkUseCase drinkUseCase)
        {
            _drinkUseCase = drinkUseCase;
        }

        // [HttpPost]
        // public async Task<IActionResult> CreateDrink([FromBody] CreateDrinkDto request)
        // {
        //     var drink = await _drinkUseCase.CreateDrinkAsync(request);
        //     return CreatedAtAction(nameof(GetDrinkById), new { drinkId = drink.Id }, drink);
        // }

        [HttpGet("{drinkId}")]
        public async Task<IActionResult> GetDrinkById(Guid drinkId)
        {
            var drink = await _drinkUseCase.GetDrinkByIdAsync(drinkId);
            if (drink == null)
                return NotFound();

            return Ok(drink);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDrinks()
        {
            var drinks = await _drinkUseCase.GetAllDrinksAsync();
            return Ok(drinks);
        }
    }
}
