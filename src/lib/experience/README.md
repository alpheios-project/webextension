# Experience
Implements support for recording of user experiences using an [Experience API](https://experienceapi.com/). It is also
called xAPI for shorts. 

There are several major component of xAPI support: Experience objects, Experience Monitor, Transporter, 
Local and Remote Stores.

## Experience object

Experience object represents a unique user experience. Experience is a base experience object. Any particular
experience should be implemented as a subclass of it.

A more detailed information: [Experience Object](doc/experience/experience.md)

## Experience monitor

Experience monitor wraps function calls with its own functions and thus gathers information about any specific
user experience. It also records a completed experience to the local storage.

A more detailed information: [Experience Monitor](doc/monitor/monitor.md)

## Transporter

Transporter moves experience objects from one storage to the other. It monitors a local storage and once
a number of experience object there reaches a threshold, it sends all those experience objects to a remote storage.

## Local Storage

Local experience storage serves as an accumulator where experiences are stored before sent to a remote server.

## Remote Storage

Remotes storage collects experiences permanently for later analysis. LRS is one example of a remote storage.

