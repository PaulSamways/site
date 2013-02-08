## &micro;Mapping

### about


### how to use

Configuring:

```
Mapping<User, UserDTO>.Configure((from, to) =>
{
    to.ID = from.ID;
    to.Name = from.Name;
    to.Email = from.Email;
});
```

Using:
```
var u = new User(999, "Paul Samways", "paul@paulsamways.com");
var dto = Mapping<User, UserDTO>.Execute(u);
```

### source

```
public static class Mapping<TFrom, TTo>
{
    private static Action<TFrom, TTo> _map;

    public static void Configure(Action<TFrom, TTo> map)
    {
        _map = map;
    }

    public static void Execute(TFrom from, TTo to)
    {
        if (_map == null)
            throw new InvalidOperationException(
                string.Format("No mapping has been configured for {0} -> {1}",
                    from.GetType(), to.GetType()));

        _map(from, to);
    }

    public static TTo Execute(TFrom from)
    {
        var to = Activator.CreateInstance<TTo>();
        Execute(from, to);

        return to;
    }

    public static IEnumerable<TTo> Execute(IEnumerable<TFrom> from)
    {
        var result = new List<TTo>();

        foreach (var item in from)
            result.Add(Execute(item));

        return result;
    }
}
```