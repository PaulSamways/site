## Using systemd to manage a Go (or any) process

### Create a unit file
The systemd unit file contains the information needed to start
and manage your process.

Using your favourite editor, create a new file in the systemd local configuration
directory. The name given to the unit file determines the name of the service.

``` Bash
$ vim /etc/systemd/system/upublish.service
```

The file format is similiar to the INI file format and contains three sections;
Unit, Service & Install. The **Unit** section holds the generic information
about the unit, such as the description. The **Service** section contains 
the information about the service and the process that will be managed. Lastly,
the **Install** section describes how the service will be installed.

Here is the unit file that I'm using to manage a &micro;Publish instance:

``` Ini
[Unit]
Description=uPublish PaulSamways.com

[Service]
ExecStart=/bin/upublish -path=/srv/http/paulsamways.com
User=nobody
Group=nobody
Restart=always

[Install]
WantedBy=multi-user.target
```

Although the options are pretty self-explanatory, I will quickly describe
each of the them:


Section   | Option        | Description
----------|---------------|------------
Unit      | Description   | The description of the service
Service   | ExecStart     | The command (with arguments) to execute when starting this service
          | User          | The user which the process is executed as
          | Group         | The group which the process is executed as
          | Restart       | Controls whether the service should be restarted if it exits
Install   | WantedBy      | Which target this unit should enabled in

For more information on the options of a unit file, consider using man

``` Bash
$ man 5 systemd.unit
$ man 5 systemd.service
```

or viewing the online documentation at [freedesktop.org](http://www.freedesktop.org/software/systemd/man/systemd.unit.html).

### Start the service

Services can be started by using the systemctl command:

``` Bash
$ sudo systemctl start upublish
```

Check to make sure the service started successfully:

``` Bash
$ sudo systemctl status upublish
```

If the service started, then stopped for whatever reason, consider reviewing
the log:

``` Bash
$ sudo journalctl --unit upublish
```

Once everything looks good, enable the service by running:

``` Bash
$ sudo systemctl enable upublish
```
