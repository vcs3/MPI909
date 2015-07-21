
        tasksController = function() {
                
                function errorLogger(errorCode, errorMessage) {
                	console.log(errorCode +':'+ errorMessage);
               }
        	var taskPage;
        	var initialised = false;   
        	return {
        		init : function(page) {
        		        
        		        
        			if (!initialised) {
        			        
        			        storageEngine.init(function() {
	                        	storageEngine.initObjectStore('task', function() {}, 	errorLogger) 
                                        }, errorLogger);
        				taskPage = page;
        				$(taskPage).find( '[required="required"]' ).prev('label').append( '<span>*</span>').children( 'span').addClass('required');
        				$(taskPage).find('tbody tr:even').addClass( 'even');
        				
        				$(taskPage).find( '#btnAddTask' ).click( function(evt) {
        					evt.preventDefault();
        					$(taskPage ).find('#taskCreation' ).removeClass( 'not');
        				});
        				$(taskPage).find('tbody tr' ).click(function(evt) {
        					$(evt.target ).closest('td').siblings( ).andSelf( ).toggleClass( 'rowHighlight');
        				});
        				/*$(taskPage ).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {
        					evt.preventDefault();
        					$(evt.target ).parents('tr').remove();
        				});*/
                                				
                        	$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
                        	function(evt) { 					
                        	
                        		storageEngine.delete('task', $(evt.target).data().taskId, 
                        			function() {
                        				$(evt.target).parents('tr').remove(); 
                        			        $(taskPage).find('#tblTasks tbody').empty();
                        				tasksController.loadTasks();
                        			}, errorLogger);
                        	    
                        	        }
                        	
                                       );
                                       
                                       
                                    $(taskPage).find('#tblTasks tbody').on('click',
                                        '.completeRow', function(evt) {
                                        storageEngine.findById('task',
                                        $(evt.target).data().taskId, function(task) {
                                        task.complete = true;
                                        storageEngine.save('task', task, function() {
                                        tasksController.loadTasks();
                                        },errorLogger);
                                        }, errorLogger);
                                        });

                                       
                                       $(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
                                	function(evt) { 
                                		$(taskPage).find('#taskCreation').removeClass('not');
                                		storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
                                			$(taskPage).find('form').fromObject(task);
                                		}, errorLogger);
                                	}
                                );
                                
                                	$(taskPage).find( '#clearTask' ).click(function(evt) {
        					evt.preventDefault();
        					$('form').each (function(){
                                                  this.reset();
                                                });
                                              
                                	});
                                	
                                	$(taskPage).find('#tblTasks tbody').on('click',
                                                '.completeRow', function(evt) {
                                                storageEngine.findById('task',
                                                $(evt.target).data().taskId, function(task) {
                                                task.complete = true;
                                                storageEngine.save('task', task, function() {
                                               
                                                },errorLogger);
                                                }, errorLogger);
                                                
                                                tasksController.loadTasks();
                                    });


        				$(taskPage).find( '#saveTask' ).click(function(evt) {
        					evt.preventDefault();
        				/*	var task = $('form').toObject();
        					if ($(taskPage).find('form').valid()){
        				        	//$('#taskRow').tmpl( task).appendTo($(taskPage ).find( '#tblTasks tbody'));
        				        	
        				        	storageEngine.save(
                                                			'task', 
                                                			task,
                                                			function(savedTask) {
                                                				$('#taskRow').tmpl(savedTask).appendTo($(taskPage).find('#tblTasks tbody'));	
                                                			}, 
                                                			errorLogger
                                                		);
        					}*/
                                        					
                                        					if ($(taskPage).find('form').valid()) {
                                		var task = $(taskPage).find('form').toObject();		
                                		storageEngine.save('task', task, function() {
                                			$(taskPage).find('#tblTasks tbody').empty();
                                			tasksController.loadTasks();
                                			$(':input').val('');
                                			$(taskPage).find('#taskCreation').addClass('not');
                                		}, errorLogger);
	}
        				});
        				initialised = true;
        				
        			}
            	},
            	loadTasks : function() {
                        	storageEngine.findAll('task', 
                        		function(tasks) {
                        		        var taskCount=0;
                        			$.each(tasks, function(index, task) {
                        			    
                        			    if (!task.complete) {
                                            task.complete = false;
                                        }

/*Foi criado uma váriavel que armazena o índice que percorre  o  objeto com as tarefas depois de  interagir com laçõ e adicionado
1 pois o índice inicia-se com 0.*/
                        				$('#taskRow').tmpl(task).appendTo( $(taskPage ).find( '#tblTasks tbody'));
                        			       taskCount=index+1;
                        			       var today = Date.today();
                        		
                        			       date= task.requiredBy.split("-");
                        			        year=date[0];
                        			        month=date[1] -1;
                        			        day=date[2];
                        			        
                        			       var dateTask= new Date(year,month,day);
                        			       
                        			  
                        			       var tempo= Date.compare(today,dateTask);
                        			       switch(tempo){
                        			               case 0:{
                        			                       console.log( $('time[datetime='+task.requeredBy+']'));
                        			                       $('time[datetime='+task.requiredBy+']').toggleClass('warning');
                        			                       break;
                        			               }
                        			                 case 1:{
                        			                       console.log( $('time[datetime='+task.requeredBy+']'));
                        			                       $('time[datetime='+task.requiredBy+']').toggleClass('overdue');
                        			                       break;
                        			               }
                        			             
                        			                       
                        			       }
                        			   
                        			       
                        			});
                        		  
                        		        	$("#taskCount").html(taskCount);
                        		        
                        		}, 
                        		errorLogger);
}
        	}
        	
        }();