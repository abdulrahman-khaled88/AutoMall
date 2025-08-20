using BussinesLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DataAccessLayer.DataAccess;

namespace AutoMall_API.Controllers
{
    [Route("api/AutoMall")]
    [ApiController]
    public class AutoMallController : ControllerBase
    {
        [HttpGet("GetAllCars")]
        public async Task<ActionResult> GetAllCarsAsync()
        {
            try
            {
                var list = await Business.GetAllCarsAsync();
                if (list == null || list.Count <= 0)
                {
                    return NotFound("Error: No Data Found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCarsAsync: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("GetAllCarsByFilters")]
        public async Task<ActionResult> GetAllCarsByFiltersAsync
        ([FromQuery] string make = "All", [FromQuery] string category = "All",
         [FromQuery] string condition = "All", [FromQuery] string price = "All",
         [FromQuery] string year = "All")
        {

            try
            {
                var list = await Business.GetAllCarsByFiltersAsync(make, category, condition, price, year);

                if (list == null || list.Count <= 0)
                {
                    return NotFound("No cars match the given filters.");
                }

                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCarsByFiltersAsync: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }



        }


        [HttpGet("GetCarsByMake")]
        public async Task<ActionResult> GetCarsByName([FromQuery] string name)
        {
            try
            {
                var list = await Business.GetCarsByName(name);

                if (list == null || list.Count <= 0)
                {
                    return NotFound("No cars match the given filters.");
                }

                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCarsByFiltersAsync: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpGet("GetUserInfo")]
        public async Task<ActionResult> GetUserInfo([FromQuery] string email, [FromQuery] string password)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                {
                    return BadRequest();
                }


                UserDTO user = await Business.GetUserInfo(email, password);

                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                return Ok(user);

            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in GetUserInfo: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new { Message = "Internal server error, please try again later." });
            }
        }



        [HttpPost("AddNewUser")]
        public async Task<ActionResult> AddNewUser([FromBody] UserDTO User)
        {
            if (User == null || string.IsNullOrWhiteSpace(User.FullName) || string.IsNullOrWhiteSpace(User.EmailAddress) || string.IsNullOrWhiteSpace(User.Password))
            {
                return BadRequest(new { message = "Invalid user data. Please provide all required fields." });
            }

            try
            {
                bool isAdded = await Business.AddNewUser(User);

                if (isAdded)
                {
                    return Ok(new { message = "User added successfully!", Status = true });
                }
                else
                {
                    return StatusCode(500, new { message = "Failed to add user due to an internal error." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Unexpected error: {ex.Message}" });
            }
        }



        [HttpPost("AddNewUserCar")]
        public async Task<ActionResult> AddNewUserCar(CarInfoDTO car, int UserID)
        {
            if (car == null ||
                string.IsNullOrWhiteSpace(car.Make) ||
                string.IsNullOrWhiteSpace(car.Model) ||
                car.Year < 2019 || car.Year > 2025 ||
                car.Mileage < 0 ||
                string.IsNullOrWhiteSpace(car.Condition) ||
                string.IsNullOrWhiteSpace(car.imagePath) ||
                string.IsNullOrWhiteSpace(car.FuelType) ||
                string.IsNullOrWhiteSpace(car.Category) ||
                string.IsNullOrWhiteSpace(car.Transmission) ||
                car.Price <= 0 ||
                UserID <= 0)
            {
                return BadRequest(new { message = "Invalid car data or UserName. Please provide all required fields correctly." });
            }




            try
            {
                bool isAdded = await Business.AddNewUserCar(car, UserID);

                if (isAdded)
                {
                    return Ok(new { message = "User Car added successfully!", Status = true });
                }
                else
                {
                    return StatusCode(500, new { message = "Failed to add User Car due to an internal error." });
                }


            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Unexpected error: {ex.Message}" });
            }





        }


        [HttpPost("AddPurchaseRecord")]
        public async Task<ActionResult> AddPurchaseRecord(int UserID, string CarImagePath, PaymentInfoDTO Payment)
        {
            try
            {
                bool isSuccess = await Business.AddPurchaseRecord(UserID, CarImagePath, Payment);

                if (isSuccess)
                {
                    return Ok("Purchase record added successfully.");
                }
                else
                {
                    return StatusCode(500, "Failed to add purchase record.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error in AddPurchaseRecord: {ex.Message}");
            }
        }


        [HttpGet("GetAllUserCars")]
        public async Task<ActionResult> GetAllUserCars(string status, int userID)
        {
            try
            {
                var list = await Business.GetAllUserCars(status, userID);
                if (list == null || list.Count <= 0)
                {
                    return NotFound("Error: No Data Found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllCarsAsync: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPut("ChangeUserPassword")]
        public async Task<ActionResult> ChangeUserPassword(int userID, string currentPassword, string newPassword)
        {
            bool isUpdated = await Business.ChangeUserPassword(userID, currentPassword, newPassword);


            if (isUpdated)
            {
                return Ok(new { message = "Password updated successfully!" });
            }
            else
            {
                return BadRequest(new { message = "Failed to update password. Please check your current password and try again." });
            }

        }



        [HttpGet("GetUserPurchaseHistory")]

        public async Task<ActionResult> GetUserPurchaseHistory(int userID)
        {
            try
            {
                var list = await Business.GetUserPurchaseHistory(userID);

                if (list == null || list.Count <= 0)
                {
                    return NotFound("Error: No Data Found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserPurchaseHistory: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("GetUserListedCars")]

        public async Task<ActionResult> GetUserListedCars(int userID)
        {
            try
            {
                var list = await Business.GetUserListedCars(userID);

                if (list == null || list.Count <= 0)
                {
                    return NotFound("Error: No Data Found");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserListedCars: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }




        [HttpDelete("DeleteCar")]
        public async Task<ActionResult> DeleteCar(int CarID)
        {
            bool isDeleted = await Business.DeleteCar(CarID);

            if (isDeleted)
            {
                return Ok(new { message = "Car deleted successfully!" });
            }
            else
            {
                return BadRequest(new { message = "Failed to delete car." });
            }
        }


        [HttpPut("UpdateListedCarInfo")]

        public async Task<ActionResult> UpdateListedCarInfo(ListedCarDTO car)
        {
            bool isUpdated = await Business.UpdateListedCarInfo(car);

            if (isUpdated)
            {
                return Ok(new { message = "Car information updated successfully!" });
            }
            else
            {
                return BadRequest(new { message = "Failed to update car information. Please try again." });
            }
        }
    }
}
