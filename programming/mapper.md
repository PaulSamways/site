## &micro;Mapper

### about
Simple object to object mapper.


### how to use

#### Configuring:

Before you can map objects you must register the function that does the 
actual mapping. This only needs to be executed once, so the best place 
is usually in the application startup code.

``` CSharp
Mapping<User, UserDTO>.Configure((from, to) => {
  to.ID = from.ID;
  to.Name = from.FirstName + " " + from.LastName;
  to.Email = from.Email;
});
```

#### Using:

Map an object to a new instance:

``` CSharp
var u = new User(1, "Paul Samways", "paul@paulsamways.com");
var dto = Mapping<User, UserDTO>.Execute(u);
```

Map an object to an existing instance:

``` CSharp
var u = new User(1, "Paul Samways", "paul@paulsamways.com");
var dto = new UserDTO();
Mapping<User, UserDTO>.Execute(u, dto);
```

Map a collection of objects:

``` CSharp
var users = new User[] {
  new User(2, "Tom", "example@paulsamways.com"),
  new User(3, "Dick", "example@paulsamways.com"),
  new User(4, "Harry", "example@paulsamways.com")
};
var dtos = users
  .Select(x => Mapping<User, UserDTO>.Execute(x))
  .ToArray();
```

### source

``` CSharp
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
  }
}
```

### download
Source code and examples are available to download as a zip archive.

<i class="icon-cloud-download"></i> [MappingExamples.zip](/public/downloads/MappingExamples.zip)
