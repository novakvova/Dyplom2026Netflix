namespace WebNetflix.Models.Users;

public class UserItem
{
    public long Id { get; set; }
    public string FullName { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string DateCreated { get; set; } = String.Empty;
}
