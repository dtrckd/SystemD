import User from "../../../../imports/classes/User";
import Project from "../../../../imports/classes/Project";
import CollaboratorAdverts from '/lib/collections/CollaboratorAdverts'
Template.projectMainPage.helpers({
    //add you helpers here
    project: function () {
        return Template.currentData();
    },
    isAdmin: function () {
        let isAdmin = false
        Meteor.user().profile.projects.forEach((userProject)=>{

            if(userProject.project_id === Template.currentData()._id
                && userProject.roles.includes("admin")){
                isAdmin = true
            }
        });
        return isAdmin
    },
    relativeDistance: function () {
        let distance = Template.currentData().relativeDistance();
        return ( distance || distance ===0) ? "( " + distance + " km )" : "" ;
    },
    numberOfMembers: function () {
        let numberOfMembers = Template.instance().numberOfMembers.get();
        return (numberOfMembers > 1) ? numberOfMembers + " membres" : numberOfMembers + " membre";
    },
    collaboratorAdverts : function () {
        return CollaboratorAdverts.find({project_id: Template.currentData()._id}).fetch()
    }
});

Template.projectMainPage.events({
    //add your events here
});

Template.projectMainPage.onCreated(function () {
    //add your statement here

    this.numberOfMembers = new ReactiveVar(1);
    let project = Template.currentData();
    project.callMethod('numberOfMembers', (err, result)=>{
        this.numberOfMembers.set(result);
    })

       Meteor.subscribe('advertsByProject', project._id)

});

Template.projectMainPage.onRendered(function () {
    //add your statement here
    $(Template.instance().firstNode).css('opacity', '1');
    Textarea.unformatBySelector("#projectDescription .formattedText")
});

Template.projectMainPage.onDestroyed(function () {
    //add your statement here
});